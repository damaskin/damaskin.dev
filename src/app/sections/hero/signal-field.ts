/**
 * "Signal field" — the hero background. A ridgeline plot drawn in one fragment shader:
 * ROWS horizontal waveforms, each one hides the lines behind it (like the classic pulsar chart),
 * peaks glow in the accent colour and the pointer sends a pulse through the nearest lines.
 * Plain WebGL2, no libraries; renders only while visible and scales its resolution down
 * when frames get slow.
 */

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPulse;
uniform float uReveal;
uniform float uCenter;
uniform float uScale;
out vec4 outColor;

const float ROWS = 34.0;
const float K = 4.5;           // tallest peak, in rows
const vec3 BG = vec3(0.039, 0.039, 0.047);
const vec3 INK = vec3(0.925, 0.92, 0.9);
const vec3 ACCENT = vec3(1.0, 0.353, 0.212);
const vec3 ACCENT2 = vec3(1.0, 0.70, 0.42);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Height of line j at x, 0..~1.6
float ridge(float x, float j, float t) {
  float center = uCenter + 0.07 * sin(j * 0.45 + t * 0.21);
  float width = 2.6 + 0.6 * sin(j * 0.31);
  float e = (x - center) * width;
  float env = exp(-e * e);
  float n = noise(vec2(x * 7.0 + j * 1.73, j * 0.41 + t * 0.32)) * 0.65
          + noise(vec2(x * 17.0 - j * 0.9, t * 0.55 + j)) * 0.35;
  float h = env * pow(n, 1.8) * 1.55;

  // pointer pulse: a travelling bump on the lines nearest to the pointer
  vec2 d = vec2((x - uPointer.x) * 1.7, (j / ROWS) - uPointer.y);
  float near = exp(-dot(d, d) * 26.0);
  float ripple = 0.65 + 0.35 * sin(x * 60.0 - t * 7.0 + j);
  h += near * uPulse * ripple * 1.1;

  return h * uReveal;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = frag / uRes;
  float t = uTime;
  float rowH = 0.86 / ROWS;           // the field fills the lower 86% of the hero
  float y = uv.y - 0.04;
  float x = uv.x;

  // background: deep vignette + warm glow under the peaks + soft light around the pointer
  vec2 g = vec2((x - uCenter) * 1.3, uv.y - 0.12);
  vec3 bgCol = BG + ACCENT * 0.075 * exp(-dot(g, g) * 5.0) * uReveal;
  vec2 pd = vec2((x - uPointer.x) * (uRes.x / uRes.y), uv.y - uPointer.y);
  bgCol += ACCENT2 * 0.035 * exp(-dot(pd, pd) * 9.0) * uPulse;

  vec3 col = bgCol;
  float jTop = floor(y / rowH) + 1.0;
  float px = uScale;                  // 1 css px in buffer px

  for (float k = 0.0; k < K + 2.5; k += 1.0) {
    float j = jTop - k;               // back (higher) to front (lower)
    // no early continue: dFdx below needs uniform control flow (ANGLE / D3D are strict about it)
    float valid = step(0.0, j) * step(j, ROWS);
    float base = j * rowH;
    float h = ridge(x, j, t);
    float cy = base + h * K * rowH;

    // what lies under this ridge hides the lines behind it
    float fill = step(base - rowH * 0.2, y) * step(y, cy) * valid;
    col = mix(col, bgCol, fill);

    // anti-aliased stroke of constant visual width on steep slopes
    float dy = (y - cy) * uRes.y;
    float slope = dFdx(cy) * uRes.y;
    float dist = abs(dy) / sqrt(1.0 + slope * slope);
    float stroke = 1.0 - smoothstep(0.55 * px, 1.35 * px, dist);

    float depth = mix(1.0, 0.38, clamp(j / ROWS, 0.0, 1.0));
    float edge = smoothstep(0.0, 0.12, x) * smoothstep(1.0, 0.88, x);
    float heat = smoothstep(0.12, 0.95, h);
    vec3 lineCol = mix(INK * 0.42, mix(ACCENT, ACCENT2, smoothstep(0.7, 1.4, h)) * 1.15, heat);
    col = mix(col, lineCol, stroke * depth * edge * valid * (0.35 + 0.65 * uReveal));
  }

  // fade into the page at the top
  col = mix(BG, col, smoothstep(0.98, 0.7, uv.y));
  outColor = vec4(col, 1.0);
}`;

export interface SignalFieldOptions {
  /** Render a single still frame (prefers-reduced-motion). */
  readonly still: boolean;
}

export class SignalField {
  private readonly gl: WebGL2RenderingContext;
  private readonly program: WebGLProgram;
  private readonly uniforms: Record<string, WebGLUniformLocation | null> = {};
  private raf = 0;
  private running = false;
  private visible = true;
  private start = performance.now();
  private lastFrame = 0;
  private slowFrames = 0;
  private scale = Math.min(window.devicePixelRatio || 1, 1.5);
  private readonly pointer = { x: 0.62, y: 0.35, tx: 0.62, ty: 0.35, pulse: 0, lastMove: 0 };
  private reveal = 0;
  private center = 0.62;
  private readonly resizeObserver: ResizeObserver;
  private readonly intersection: IntersectionObserver;

  /** Returns null when WebGL2 is unavailable — the hero then keeps its CSS fallback. */
  static create(canvas: HTMLCanvasElement, options: SignalFieldOptions): SignalField | null {
    // No GPU (software rendering, e.g. SwiftShader) means a full-screen shader burns the CPU —
    // such browsers keep the static CSS background instead.
    const gl = canvas.getContext('webgl2', {
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      failIfMajorPerformanceCaveat: true,
    });
    if (!gl || SignalField.isSoftware(gl)) return null;
    try {
      return new SignalField(canvas, gl, options);
    } catch {
      return null;
    }
  }

  private static isSoftware(gl: WebGL2RenderingContext): boolean {
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
  }

  private constructor(
    private readonly canvas: HTMLCanvasElement,
    gl: WebGL2RenderingContext,
    private readonly options: SignalFieldOptions,
  ) {
    this.gl = gl;
    this.program = this.link(VERT, FRAG);
    gl.useProgram(this.program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.program, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    for (const name of ['uRes', 'uTime', 'uPointer', 'uPulse', 'uReveal', 'uCenter', 'uScale']) {
      this.uniforms[name] = gl.getUniformLocation(this.program, name);
    }

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.loop();
    });
    this.intersection.observe(canvas);
    document.addEventListener('visibilitychange', this.onVisibility);
    canvas.addEventListener('webglcontextlost', this.onContextLost);
    this.resize();
  }

  /** 0..1 — how much of the field has "grown" in (driven by the intro timeline). */
  setReveal(value: number): void {
    this.reveal = value;
    if (this.options.still) this.draw(performance.now());
  }

  /** Pointer position in canvas-relative 0..1 coordinates (y down, like the DOM). */
  pointerMove(x: number, y: number): void {
    const now = performance.now();
    this.pointer.tx = x;
    this.pointer.ty = 1 - y;
    // a quick move gives a stronger pulse
    this.pointer.pulse = Math.min(1, this.pointer.pulse + 0.12);
    this.pointer.lastMove = now;
  }

  play(): void {
    this.running = true;
    this.loop();
  }

  destroy(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);
    this.gl.getExtension('WEBGL_lose_context')?.loseContext();
  }

  private loop = (): void => {
    cancelAnimationFrame(this.raf);
    if (!this.running || !this.visible || document.hidden) return;
    this.raf = requestAnimationFrame((now) => {
      this.adapt(now);
      this.draw(now);
      if (!this.options.still) this.loop();
    });
  };

  private draw(now: number): void {
    const gl = this.gl;
    const p = this.pointer;
    const t = this.options.still ? 12 : (now - this.start) / 1000;

    // With no pointer for a while (touch screens, idle mouse) the pulse wanders on its own.
    if (now - p.lastMove > 2500) {
      p.tx = this.center + Math.sin(t * 0.23) * 0.22;
      p.ty = 0.32 + Math.sin(t * 0.37) * 0.14;
      p.pulse += (0.45 - p.pulse) * 0.02;
    } else {
      p.pulse *= 0.985;
    }
    p.x += (p.tx - p.x) * 0.08;
    p.y += (p.ty - p.y) * 0.08;

    gl.uniform2f(this.uniforms['uRes'], this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms['uTime'], t);
    gl.uniform2f(this.uniforms['uPointer'], p.x, p.y);
    gl.uniform1f(this.uniforms['uPulse'], p.pulse);
    gl.uniform1f(this.uniforms['uReveal'], this.reveal);
    gl.uniform1f(this.uniforms['uCenter'], this.center);
    gl.uniform1f(this.uniforms['uScale'], this.scale);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /** Drop the render scale step by step if the GPU cannot keep up (~40 fps floor). */
  private adapt(now: number): void {
    const dt = now - this.lastFrame;
    this.lastFrame = now;
    if (dt > 0 && dt < 200) {
      this.slowFrames = dt > 25 ? this.slowFrames + 1 : Math.max(0, this.slowFrames - 1);
      if (this.slowFrames > 30 && this.scale > 0.6) {
        this.scale = Math.max(0.6, this.scale - 0.2);
        this.slowFrames = 0;
        this.resize();
      }
    }
  }

  private resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width * this.scale));
    const height = Math.max(1, Math.round(rect.height * this.scale));
    // Field peaks sit right of the text on wide screens and in the middle on phones.
    this.center = rect.width >= 900 ? 0.64 : 0.5;
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.gl.viewport(0, 0, width, height);
    }
    if (this.options.still || !this.running) this.draw(performance.now());
  }

  private onVisibility = (): void => {
    if (!document.hidden) this.loop();
  };

  private onContextLost = (event: Event): void => {
    event.preventDefault();
    this.running = false;
    this.canvas.dispatchEvent(new CustomEvent('signalfield:lost', { bubbles: true }));
  };

  private link(vertSrc: string, fragSrc: string): WebGLProgram {
    const gl = this.gl;
    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed');
      }
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertSrc));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed');
    }
    return program;
  }
}
