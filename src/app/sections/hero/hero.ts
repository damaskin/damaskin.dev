import { Component, computed, input } from '@angular/core';
import { GITHUB_URL, SITE_URL, SiteContent } from '../../content';

/** First screen: who, what, where, how to reach — and the four numbers that sum up the CV. */
@Component({
  selector: 'dd-hero',
  template: `
    @let c = content();
    @let h = c.hero;
    <div class="container">
      <p class="status">
        <span class="status__badge"
          ><span class="status__dot" aria-hidden="true"></span>{{ h.status }}</span
        >
        <span class="status__place">{{ h.location }}</span>
      </p>

      <h1 class="name">{{ h.firstName }} {{ h.lastName }}</h1>
      <p class="role">
        @for (part of h.role.split(' · '); track part; let last = $last) {
          <span class="role__part">{{ part }}</span
          >{{ last ? '' : ' · ' }}
        }
      </p>
      <p class="lead">{{ h.lead }}</p>
      <p class="print-only print-contacts mono">{{ printContacts() }}</p>

      <div class="actions no-print">
        <a class="btn btn--primary" [href]="'mailto:' + c.contact.email">
          {{ h.primaryCta }}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </a>
        <a class="btn" [href]="c.cvHref" download="Ivan_Damaskin_CV.pdf">
          {{ h.secondaryCta }}
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 2v9M4 7l4 4 4-4M3 14h10"
              fill="none"
              stroke="currentColor"
              stroke-width="1.6"
            />
          </svg>
        </a>
        <span class="actions__links">
          @for (link of profiles(); track link.href) {
            <a class="link" [href]="link.href" target="_blank" rel="noopener me">
              {{ link.label }}
              <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" />
              </svg>
              <span class="sr-only">({{ c.a11y.opensInNewTab }})</span>
            </a>
          }
        </span>
      </div>

      <ul class="metrics">
        @for (m of c.metrics; track m.label) {
          <li class="metric">
            <span class="metric__value">{{ m.value }}</span>
            <span class="metric__label">{{ m.label }}</span>
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './hero.scss',
  host: { class: 'hero', id: 'top' },
})
export class Hero {
  readonly content = input.required<SiteContent>();

  /** On paper the buttons are gone, so the contacts go right under the lead. */
  protected readonly printContacts = computed(() =>
    [this.content().contact.email, SITE_URL, GITHUB_URL]
      .map((s) => s.replace('https://', ''))
      .join(' · '),
  );

  /** Public profiles (GitHub, hh.ru) — the external links of the contact block. */
  protected readonly profiles = computed(() =>
    this.content().contact.links.filter((l) => l.href.startsWith('http')),
  );
}
