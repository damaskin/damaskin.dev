import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';

@Component({
  selector: 'dd-stack',
  template: `
    @let s = content().stack;
    <div class="container section__grid">
      <header class="section__label">
        <span class="section__index" aria-hidden="true">{{ s.index }}</span>
        <h2 class="section__title">{{ s.label }}</h2>
      </header>
      <dl class="groups">
        @for (group of s.groups; track group.title) {
          <div class="group reveal">
            <dt class="group__title mono">{{ group.title }}</dt>
            <dd>
              <ul class="group__items">
                @for (item of group.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </dd>
          </div>
        }
      </dl>
    </div>
  `,
  styles: `
    .group {
      display: grid;
      gap: 6px;
      padding-block: 18px;
      border-top: 1px solid var(--line);

      &:first-child {
        border-top: 0;
        padding-top: 4px;
      }

      @media (min-width: 700px) {
        grid-template-columns: 10.5rem minmax(0, 1fr);
        gap: 24px;
      }
    }

    .group__title {
      font-size: 0.75rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      line-height: 2.2;
      color: var(--accent);
    }

    .group__items {
      display: flex;
      flex-wrap: wrap;
      gap: 2px 0;
      font-size: 1.0625rem;

      li:not(:last-child)::after {
        content: '·';
        margin-inline: 10px;
        color: var(--fg-dim);
      }
    }
  `,
  host: { class: 'section', id: 'stack' },
})
export class Stack {
  readonly content = input.required<SiteContent>();
}
