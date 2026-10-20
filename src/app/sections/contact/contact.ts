import { Component, input, signal } from '@angular/core';
import { SiteContent } from '../../content';

@Component({
  selector: 'dd-contact',
  template: `
    @let c = content();
    @let k = c.contact;
    <div class="container section__grid">
      <header class="section__label">
        <span class="section__index" aria-hidden="true">{{ k.index }}</span>
        <h2 class="section__title">{{ k.label }}</h2>
      </header>

      <div class="body">
        <p class="section__lead">{{ k.title }}</p>
        <p class="text">{{ k.text }}</p>

        <div class="mail">
          <a class="mail__link" [href]="'mailto:' + k.email">{{ k.email }}</a>
          <button
            class="mail__copy no-print"
            type="button"
            (click)="copyEmail()"
            [attr.aria-label]="c.a11y.copy"
          >
            @if (copied()) {
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="m3 8 3 3 7-7" fill="none" stroke="currentColor" stroke-width="1.8" />
              </svg>
            } @else {
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <rect
                  x="5"
                  y="5"
                  width="9"
                  height="9"
                  rx="2"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M11 3H4a1 1 0 0 0-1 1v7"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
            }
          </button>
          <span class="mail__toast mono" role="status">{{ copied() ? c.a11y.copied : '' }}</span>
        </div>

        <ul class="phones">
          @for (phone of k.phones; track phone.href) {
            <li>
              <a class="phones__link" [href]="phone.href">{{ phone.label }}</a>
            </li>
          }
        </ul>

        <ul class="links">
          @for (link of k.links; track link.href) {
            <li>
              @if (link.href.startsWith('http')) {
                <a class="btn" [href]="link.href" target="_blank" rel="noopener me">
                  {{ link.label }}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M5 11 11 5M6 5h5v5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                    />
                  </svg>
                  <span class="sr-only">({{ c.a11y.opensInNewTab }})</span>
                </a>
              } @else {
                <a class="btn btn--primary" [href]="link.href" download="Ivan_Damaskin_CV.pdf">
                  {{ link.label }}
                  <svg viewBox="0 0 16 16" aria-hidden="true">
                    <path
                      d="M8 2v9M4 7l4 4 4-4M3 14h10"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.6"
                    />
                  </svg>
                </a>
              }
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: `
    .text {
      max-width: 56ch;
      margin-top: 16px;
      color: var(--fg-muted);
    }

    .mail {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px 14px;
      margin-top: clamp(28px, 4vw, 44px);
    }

    .mail__link {
      font-size: clamp(1.5rem, 0.9rem + 3vw, 3.25rem);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.035em;
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-decoration-color: var(--accent);
      text-underline-offset: 0.18em;
      transition: color 0.2s;

      &:hover {
        color: var(--accent);
      }
    }

    .mail__copy {
      display: grid;
      place-items: center;
      width: 44px;
      height: 44px;
      border: 1px solid var(--line-strong);
      border-radius: 50%;
      background: none;
      color: var(--fg-muted);
      cursor: pointer;
      transition:
        color 0.2s,
        border-color 0.2s;

      &:hover {
        border-color: var(--fg);
        color: var(--fg);
      }

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .mail__toast {
      font-size: 0.8125rem;
      color: var(--ok);
    }

    .phones {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 28px;
      margin-top: 18px;
    }

    .phones__link {
      font-size: clamp(1.125rem, 0.95rem + 0.9vw, 1.625rem);
      font-weight: 500;
      letter-spacing: -0.02em;
      white-space: nowrap;
      text-decoration: underline;
      text-decoration-thickness: 1px;
      text-decoration-color: var(--line-strong);
      text-underline-offset: 0.2em;
      transition:
        color 0.2s,
        text-decoration-color 0.2s;

      &:hover {
        color: var(--accent);
        text-decoration-color: currentColor;
      }
    }

    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: clamp(24px, 3vw, 36px);
    }

    @media print {
      .mail__link {
        font-size: 16pt;
      }

      .phones {
        gap: 2pt 14pt;
        margin-top: 4pt;
      }

      .phones__link {
        font-size: 11pt;
      }

      .links {
        flex-direction: column;
        gap: 2pt;
        margin-top: 8pt;
      }
    }
  `,
  host: { class: 'section', id: 'contact' },
})
export class Contact {
  readonly content = input.required<SiteContent>();

  protected readonly copied = signal(false);

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.content().contact.email);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2200);
    } catch {
      location.href = `mailto:${this.content().contact.email}`;
    }
  }
}
