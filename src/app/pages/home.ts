import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CONTENT, Lang } from '../content';
import { Seo } from '../core/seo';
import { About } from '../sections/about/about';
import { AiWorkflow } from '../sections/ai-workflow/ai-workflow';
import { Contact } from '../sections/contact/contact';
import { Experience } from '../sections/experience/experience';
import { Hero } from '../sections/hero/hero';
import { Projects } from '../sections/projects/projects';
import { SiteFooter } from '../sections/site-footer/site-footer';
import { SiteHeader } from '../sections/site-header/site-header';
import { Stack } from '../sections/stack/stack';

/** The whole CV on one page; `/` renders it in Russian, `/en` in English (route data `lang`). */
@Component({
  selector: 'dd-home',
  imports: [SiteHeader, Hero, About, Experience, Projects, AiWorkflow, Stack, Contact, SiteFooter],
  template: `
    <dd-site-header [content]="content" />
    <main id="main" tabindex="-1">
      <dd-hero [content]="content" />
      <dd-about [content]="content" />
      <dd-experience [content]="content" />
      <dd-projects [content]="content" />
      <dd-ai-workflow [content]="content" />
      <dd-stack [content]="content" />
      <dd-contact [content]="content" />
    </main>
    <dd-site-footer [content]="content" />
  `,
  styles: `
    main:focus {
      outline: none;
    }
  `,
})
export class Home {
  protected readonly content =
    CONTENT[(inject(ActivatedRoute).snapshot.data['lang'] as Lang | undefined) ?? 'ru'];

  constructor() {
    inject(Seo).apply(this.content);
  }
}
