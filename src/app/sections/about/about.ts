import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';

@Component({
  selector: 'dd-about',
  template: `
    @let a = content().about;
    <div class="container section__grid">
      <header class="section__label">
        <span class="section__index" aria-hidden="true">{{ a.index }}</span>
        <h2 class="section__title">{{ a.label }}</h2>
      </header>
      <div class="body">
        <p class="section__lead">{{ a.statement }}</p>
        <p class="text reveal">{{ a.text }}</p>
        <dl class="facts reveal">
          @for (f of a.facts; track f.term) {
            <div class="fact">
              <dt class="mono">{{ f.term }}</dt>
              <dd>{{ f.value }}</dd>
            </div>
          }
        </dl>
      </div>
    </div>
  `,
  styleUrl: './about.scss',
  host: { class: 'section', id: 'about' },
})
export class About {
  readonly content = input.required<SiteContent>();
}
