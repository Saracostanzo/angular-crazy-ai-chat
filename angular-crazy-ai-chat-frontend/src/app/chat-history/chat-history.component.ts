import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-chat-history',
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.css'],
  standalone: true,
  imports: [CommonModule, MessageComponent],
})
export class ChatHistoryComponent {
  messages: { text: string; sender: 'user' | 'ai' }[] = [];

  addMessage(msg: { text: string; sender: 'user' | 'ai' }) {
    this.messages.push(msg);
  }
}
