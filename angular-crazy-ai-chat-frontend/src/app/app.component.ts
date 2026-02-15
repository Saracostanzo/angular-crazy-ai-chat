import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component'; // ./chat/ perché chat è dentro app

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent],
  template: `<div class="app-container">
               <app-chat></app-chat>
             </div>`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
