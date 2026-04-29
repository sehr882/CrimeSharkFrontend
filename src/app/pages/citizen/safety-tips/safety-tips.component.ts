import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage } from '@app/services/ai.service';

@Component({
  selector: 'app-safety-tips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="smart-help-page">

  <div class="chat-header">
    <div class="chat-header__icon">🤖</div>
    <div>
      <h1>Smart Help</h1>
      <p>Ask about safety in any area — just type a name, keyword, or question</p>
    </div>
  </div>

  <div class="chat-wrap">

    <div class="chat-suggestions">
      <span>Try:</span>
      <button *ngFor="let s of suggestions" (click)="sendSuggestion(s)" class="suggestion-pill">
        {{ s }}
      </button>
    </div>

    <div class="chat-messages" #chatScroll>
      <div
        *ngFor="let msg of messages"
        [class]="'chat-msg chat-msg--' + msg.role"
      >{{ msg.content }}</div>

      <div *ngIf="loading" class="chat-msg chat-msg--assistant chat-msg--loading">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </div>

    <div class="chat-input-row">
      <input
        #inputEl
        [(ngModel)]="inputText"
        (keyup.enter)="send()"
        placeholder="Type an area name or ask a question..."
        [disabled]="loading"
        maxlength="300"
      />
      <button (click)="send()" [disabled]="loading || !inputText.trim()">
        <span class="material-icons-outlined">send</span>
      </button>
    </div>

  </div>
</div>
  `,
  styles: [`
.smart-help-page {
  min-height: 100vh;
  background: #f4f7fb;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px 20px;
  font-family: Inter, system-ui, sans-serif;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  text-align: left;

  &__icon {
    font-size: 48px;
    line-height: 1;
  }

  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 4px;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: #64748b;
  }
}

.chat-wrap {
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 580px;
}

.chat-suggestions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding: 14px 18px;
  border-bottom: 1px solid #f0f4f8;
  background: #fafbfc;

  span {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.suggestion-pill {
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 12px;
  color: #4f46e5;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;

  &:hover {
    background: #f0f0ff;
    border-color: #6366f1;
  }
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e0e8f2; border-radius: 4px; }
}

.chat-msg {
  padding: 11px 15px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 80%;
  word-break: break-word;

  &--user {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 4px;
  }

  &--assistant {
    background: #f1f5f9;
    color: #1e293b;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }

  &--loading {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 14px 18px;
  }
}

.chat-input-row {
  display: flex;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid #f0f4f8;

  input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #dde3ec;
    border-radius: 12px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.2s;

    &:focus { border-color: #6366f1; }
    &:disabled { background: #f8f9fa; cursor: not-allowed; }
  }

  button {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border: none;
    border-radius: 12px;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;

    .material-icons-outlined { font-size: 20px; }

    &:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(79, 70, 229, 0.4);
    }

    &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
  }
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #94a3b8;
  animation: bounce 1.2s infinite ease-in-out;

  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.4s; }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40%           { transform: translateY(-6px); }
}
  `]
})
export class SafetyTipsComponent {

  @ViewChild('chatScroll') chatScroll!: ElementRef<HTMLDivElement>;

  messages: ChatMessage[] = [
    { role: 'assistant', content: 'Hi! I\'m your Safety Assistant. Ask me about any area — just type a name like "F-10" or ask "which area is most dangerous?"' }
  ];
  inputText = '';
  loading = false;

  suggestions = ['Safety tips', 'What is the high alert area?', 'Most dangerous area?', 'Safest area?', 'is rawalpindi safe?'];

  constructor(private aiService: AiService, private cdr: ChangeDetectorRef) {}

  sendSuggestion(text: string): void {
    this.inputText = text;
    this.send();
  }

  send(): void {
    const text = this.inputText.trim();
    if (!text || this.loading) return;

    this.inputText = '';
    this.messages = [...this.messages, { role: 'user', content: text }];
    this.loading = true;
    this.cdr.detectChanges();
    this._scrollToBottom();

    const history = this.messages.slice(1, -1);

    this.aiService.chat(text, history).subscribe({
      next: (res) => {
        this.messages = [...this.messages, { role: 'assistant', content: res.reply }];
        this.loading = false;
        this.cdr.detectChanges();
        this._scrollToBottom();
      },
      error: () => {
        this.messages = [...this.messages, {
          role: 'assistant',
          content: 'Safety service is currently unavailable. Please try again shortly.'
        }];
        this.loading = false;
        this.cdr.detectChanges();
        this._scrollToBottom();
      }
    });
  }

  private _scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatScroll?.nativeElement) {
        this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
      }
    }, 50);
  }
}
