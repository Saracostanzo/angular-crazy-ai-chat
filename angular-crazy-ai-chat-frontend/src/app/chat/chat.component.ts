import { Component } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  messages: any[] = [];
  userInput: string = '';

  constructor(private chatService: ChatService) {}

  send() {
    if (!this.userInput.trim()) return;

    // Aggiungo messaggio utente
    this.messages.push({ text: this.userInput, sender: 'user' });

    const messageToSend = this.userInput;
    this.userInput = '';

    this.chatService.sendMessage(messageToSend)
      .subscribe(response => {
        this.messages.push({
          text: response.reply,
          sender: 'ai'
        });
      });
  }
}
