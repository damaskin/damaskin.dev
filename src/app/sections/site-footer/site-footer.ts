import { Component, computed, input } from '@angular/core';
import { LANG_PATH, SOURCE_URL, SiteContent } from '../../content';

/** Short commit SHA, injected by `ng build --define BUILD_SHA=...` in CI (see angular.json for the local default). */
declare const BUILD_SHA: string;

@Component({
  selector: 'dd-site-footer',
  template: `
    @let c = content();
    <div class="footer container mono">
      <p>© {{ year }} {{ c.hero.firstName }} {{ c.hero.lastName }}</p>
      <p class="footer__built">{{ c.footer.builtWith }}</p>
      <p class="footer__links">
        <a [href]="sourceUrl" target="_blank" rel="noopener"
          >{{ c.footer.source }}<span class="sr-only"> ({{ c.a11y.opensInNewTab }})</span></a
        >
        <span aria-hidden="true">·</span>
        <span>{{ c.footer.build }} {{ build }}</span>
        <span aria-hidden="true">·</span>
        <a [href]="otherLangHref()" [attr.hreflang]="otherLang()">{{ c.a11y.langSwitch }}</a>
      </p>
    </div>
  `,
  styles: `
    :host {
      display: block;
      border-top: 1px solid var(--line);
    }
    .footer {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px 32px;
      padding-block: 28px;
      font-size: 0.8125rem;
      color: var(--fg-muted);
    }
    .footer__links {
      display: flex;
      flex-wrap: wrap;
      gap: 6px 12px;
    }
    a {
      color: var(--fg);
      text-decoration: underline;
      text-decoration-color: var(--line-strong);
      text-underline-offset: 4px;
      transition:
        text-decoration-color 0.25s,
        color 0.25s;
    }
    a:hover {
      color: var(--accent);
      text-decoration-color: var(--accent);
    }
  `,
})
export class SiteFooter {
  readonly content = input.required<SiteContent>();

  protected readonly year = new Date().getFullYear();
  protected readonly sourceUrl = SOURCE_URL;
  protected readonly build = BUILD_SHA.slice(0, 7);
  protected readonly otherLang = computed(() => (this.content().lang === 'ru' ? 'en' : 'ru'));
  protected readonly otherLangHref = computed(() => LANG_PATH[this.otherLang()]);
}
