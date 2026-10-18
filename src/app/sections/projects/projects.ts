import { Component, input } from '@angular/core';
import { SiteContent } from '../../content';

@Component({
  selector: 'dd-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
  host: { class: 'section', id: 'projects' },
})
export class Projects {
  readonly content = input.required<SiteContent>();
}
