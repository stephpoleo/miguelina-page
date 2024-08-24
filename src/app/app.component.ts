import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PresentationComponent } from './presentation/presentation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PresentationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Miguelina Ruiz';
}
