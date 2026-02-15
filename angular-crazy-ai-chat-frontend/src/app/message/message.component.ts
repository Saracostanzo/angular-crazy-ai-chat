import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent {
  @Input() text: string = '';              // testo del messaggio
  @Input() sender: 'user' | 'ai' = 'user'; // chi ha inviato il messaggio
}
