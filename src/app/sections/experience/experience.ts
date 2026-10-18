import { Component, computed, input } from '@angular/core';
import { SiteContent, buildTimeline, formatPeriod } from '../../content';

/** Career timeline (one bar per job, 2013 → now) followed by the jobs themselves. */
@Component({
  selector: 'dd-experience',
  template: `
    @let e = content().experience;
    @let t = timeline();
    <div class="container section__grid">
      <header class="section__label">
        <span class="section__index" aria-hidden="true">{{ e.index }}</span>
        <h2 class="section__title">{{ e.label }}</h2>
      </header>

      <div class="body">
        <p class="section__lead">{{ e.title }}</p>

        <figure class="timeline" [style.--years]="t.ticks.length">
          <figcaption class="timeline__caption mono">{{ e.timelineLabel }}</figcaption>
          <div class="timeline__axis" aria-hidden="true">
            @for (tick of t.ticks; track tick.year) {
              <span class="tick" [class.tick--minor]="!tick.major" [style.left.%]="tick.left">{{
                tick.year
              }}</span>
            }
          </div>
          <ol class="timeline__rows">
            @for (bar of t.bars; track bar.job.id) {
              <li class="trow">
                <a class="trow__label" [href]="'#job-' + bar.job.id">
                  <span class="trow__company">{{ bar.job.company }}</span>
                  <span class="trow__years mono">{{ bar.from }} — {{ bar.to }}</span>
                </a>
                <span class="trow__track" aria-hidden="true">
                  <span
                    class="trow__bar"
                    [class.trow__bar--now]="!bar.job.end"
                    [style.left.%]="bar.left"
                    [style.width.%]="bar.width"
                  ></span>
                </span>
              </li>
            }
          </ol>
        </figure>

        <ol class="jobs">
          @for (row of rows(); track row.job.id) {
            <li class="job reveal" [id]="'job-' + row.job.id" data-job>
              <div class="job__head">
                <h3 class="job__company">{{ row.job.company }}</h3>
                <p class="job__role">{{ row.job.role }}</p>
                <p class="job__period mono">
                  @if (!row.job.end) {
                    <span class="job__live" aria-hidden="true"></span>
                  }
                  {{ row.range }}<span class="job__duration"> · {{ row.duration }}</span>
                </p>
              </div>
              <p class="job__summary">{{ row.job.summary }}</p>
              @if (row.job.points.length) {
                <ul class="job__points">
                  @for (point of row.job.points; track $index) {
                    <li>{{ point }}</li>
                  }
                </ul>
              }
              <p class="sr-only">{{ e.stackLabel }}:</p>
              <ul class="tags job__stack">
                @for (tech of row.job.stack; track tech) {
                  <li class="tag">{{ tech }}</li>
                }
              </ul>
            </li>
          }
        </ol>

        <p class="education reveal">
          <span class="education__label mono">{{ e.education.label }}</span>
          <span>{{ e.education.text }}</span>
        </p>
      </div>
    </div>
  `,
  styleUrl: './experience.scss',
  host: { class: 'section', id: 'experience' },
})
export class Experience {
  readonly content = input.required<SiteContent>();

  // Durations of current jobs and the right end of the axis are counted up to the build date.
  private readonly now = new Date();

  protected readonly timeline = computed(() =>
    buildTimeline(this.content().experience.jobs, this.content(), this.now),
  );

  protected readonly rows = computed(() =>
    this.content().experience.jobs.map((job) => ({
      job,
      ...formatPeriod(job, this.content(), this.now),
    })),
  );
}
