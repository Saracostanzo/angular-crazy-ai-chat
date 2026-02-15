import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { MessageComponent } from '../message/message.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages: any[] = [];
  userInput: string = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  send() {
    if (!this.userInput.trim()) return;

    this.messages.push({ text: this.userInput, sender: 'user' });

    const messageToSend = this.userInput;
    this.userInput = '';
    this.loading = true;

    this.chatService.sendMessage(messageToSend)
      .subscribe(
        (response: any) => {
          
          this.messages.push({ text: response.reply, sender: 'ai' });
          this.loading = false;
        },
        (err) => {
          this.messages.push({ text: "Oops, errore nel server 😅", sender: 'ai' });
          this.loading = false;
        }
      );
  }
}
