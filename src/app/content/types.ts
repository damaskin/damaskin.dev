export type Lang = 'ru' | 'en';

export interface Link {
  readonly label: string;
  readonly href: string;
}

export interface Metric {
  /** Number the counter animates to; `from` lets "Angular 11 → 22" tick from 11. */
  readonly value: number;
  readonly from?: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: string;
}

export interface Job {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  /** ISO month, e.g. 2021-12. */
  readonly start: string;
  /** ISO month or null for the current job. */
  readonly end: string | null;
  readonly summary: string;
  readonly points: readonly string[];
  readonly stack: readonly string[];
  /** Git-graph lane: 0 — main line, 1 — parallel branch. */
  readonly lane: 0 | 1;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly kind: string;
  readonly url?: string;
  readonly urlLabel?: string;
  readonly description: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
  readonly image?: {
    readonly src: string;
    readonly alt: string;
    readonly width: number;
    readonly height: number;
    readonly mobileSrc?: string;
  };
  /** Steps for a project that is shown as a flow instead of a screenshot. */
  readonly flow?: readonly string[];
}

export interface StackGroup {
  readonly title: string;
  readonly items: readonly string[];
}

export interface AiPoint {
  readonly title: string;
  readonly text: string;
}

export interface TerminalLine {
  readonly kind: 'cmd' | 'step' | 'ok';
  readonly tag?: string;
  readonly text: string;
}

export interface SiteContent {
  readonly lang: Lang;
  readonly meta: {
    readonly title: string;
    readonly description: string;
    readonly ogImage: string;
    readonly locale: string;
  };
  readonly a11y: {
    readonly menu: string;
    readonly skip: string;
    readonly nav: string;
    readonly langSwitch: string;
    readonly opensInNewTab: string;
    readonly copied: string;
    readonly copy: string;
  };
  readonly nav: readonly Link[];
  readonly cvLabel: string;
  readonly cvHref: string;
  readonly hero: {
    readonly eyebrow: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly lead: string;
    readonly status: string;
    readonly location: string;
    readonly primaryCta: string;
    readonly secondaryCta: string;
    readonly scroll: string;
  };
  readonly metrics: readonly Metric[];
  readonly about: {
    readonly index: string;
    readonly label: string;
    readonly statement: string;
    readonly text: string;
    readonly facts: readonly { readonly term: string; readonly value: string }[];
  };
  readonly experience: {
    readonly index: string;
    readonly label: string;
    readonly title: string;
    readonly present: string;
    readonly stackLabel: string;
    readonly jobs: readonly Job[];
    readonly education: { readonly label: string; readonly text: string };
  };
  readonly projects: {
    readonly index: string;
    readonly label: string;
    readonly title: string;
    readonly hint: string;
    readonly open: string;
    readonly items: readonly Project[];
    readonly clients: { readonly label: string; readonly items: readonly string[] };
  };
  readonly ai: {
    readonly index: string;
    readonly label: string;
    readonly title: string;
    readonly text: string;
    readonly points: readonly AiPoint[];
    readonly terminalTitle: string;
    readonly terminalNote: string;
    readonly terminal: readonly TerminalLine[];
  };
  readonly stack: {
    readonly index: string;
    readonly label: string;
    readonly title: string;
    readonly groups: readonly StackGroup[];
  };
  readonly contact: {
    readonly index: string;
    readonly label: string;
    readonly title: string;
    readonly text: string;
    readonly email: string;
    readonly links: readonly Link[];
  };
  readonly footer: {
    readonly builtWith: string;
    readonly source: string;
    readonly build: string;
  };
  readonly durations: {
    readonly year: (n: number) => string;
    readonly month: (n: number) => string;
    readonly months: readonly string[];
  };
}
