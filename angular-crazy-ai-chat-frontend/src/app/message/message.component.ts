import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  template: `<div [ngClass]="sender">{{ text }}</div>`,
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() text: string = '';
  @Input() sender: 'user' | 'ai' = 'user';
}
