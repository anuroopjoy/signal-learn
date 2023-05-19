import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChildComponent } from './child/child.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChildComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  show = true;

  toggleChild() {
    this.show = !this.show;
  }
}
