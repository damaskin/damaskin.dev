import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'dd-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {}
