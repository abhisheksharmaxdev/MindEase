import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { timeout } from 'rxjs/operators';
import { DataService } from '../../core/services/data.service';
import { FooterComponent } from '../../shared/footer/footer.component';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-mindmate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  styles: [`
    .mindmate-page { min-height: 100vh; background:
      radial-gradient(circle at top left, rgba(251,192,45,0.18), transparent 24%),
      radial-gradient(circle at bottom right, rgba(140,82,255,0.18), transparent 28%),
      linear-gradient(180deg, #0f071c 0%, #140923 100%);
      color: #fff;
    }
    .shell { max-width: 1180px; margin: 0 auto; padding: 28px 20px 48px; }
    .topbar { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
    .topbar a { color:#fff; text-decoration:none; }
    .hero { display:grid; grid-template-columns: 0.95fr 1.25fr; gap:24px; align-items:stretch; }
    .intro, .chat-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(18px); border-radius: 28px; }
    .intro { padding: 28px; }
    .eyebrow { display:inline-flex; padding:8px 14px; border-radius:999px; background:#fbc02d; color:#180d2a; font-weight:700; font-size:12px; letter-spacing:0.03em; }
    .intro h1 { font-size: clamp(2.4rem, 4vw, 4rem); line-height:1.02; margin:18px 0 16px; }
    .intro h1 span { color:#fbc02d; }
    .intro p { color:#ddd5ef; line-height:1.7; font-size:1rem; }
    .chips { display:flex; flex-wrap:wrap; gap:10px; margin-top:20px; }
    .chip { padding:10px 14px; border-radius:999px; background: rgba(255,255,255,0.08); color:#f4eefc; font-size:13px; }
    .chat-card { display:flex; flex-direction:column; min-height: 72vh; }
    .chat-header { padding: 22px 24px 16px; border-bottom:1px solid rgba(255,255,255,0.08); }
    .chat-header h2 { margin:0; font-size:1.4rem; }
    .chat-header p { margin:8px 0 0; color:#d8d0ea; }
    .messages { flex:1; padding:20px; display:flex; flex-direction:column; gap:14px; overflow:auto; }
    .bubble { max-width:82%; padding:14px 16px; border-radius:22px; line-height:1.6; white-space:pre-wrap; }
    .bubble.user { align-self:flex-end; background:#8c52ff; color:#fff; border-bottom-right-radius:8px; }
    .bubble.assistant { align-self:flex-start; background:#201135; color:#f7f3ff; border:1px solid rgba(255,255,255,0.08); border-bottom-left-radius:8px; }
    .composer { padding:18px; border-top:1px solid rgba(255,255,255,0.08); display:grid; gap:12px; }
    .quick-prompts { display:flex; flex-wrap:wrap; gap:10px; }
    .quick-prompts button { background:#1e1233; color:#f0e6ff; border:1px solid rgba(255,255,255,0.09); border-radius:999px; padding:10px 14px; cursor:pointer; }
    .compose-row { display:flex; gap:12px; align-items:flex-end; }
    textarea { flex:1; min-height:74px; max-height:180px; resize:vertical; padding:14px 16px; border-radius:18px; border:1px solid #4c3277; background:#120823; color:#fff; }
    .send-btn { border:none; border-radius:18px; padding:14px 20px; background:#fbc02d; color:#180d2a; font-weight:800; cursor:pointer; min-width:112px; }
    .send-btn:disabled { opacity:0.6; cursor:not-allowed; }
    .note { color:#d5cae8; font-size:12px; }
    @media (max-width: 920px) {
      .hero { grid-template-columns:1fr; }
      .chat-card { min-height: 68vh; }
      .bubble { max-width: 92%; }
    }
  `],
  template: `
    <div class="mindmate-page">
      <div class="shell">
        <div class="topbar">
          <a routerLink="/">Back to Home</a>
          <a routerLink="/dashboard">My Dashboard</a>
        </div>

        <section class="hero">
          <aside class="intro">
            <span class="eyebrow">MindMate AI</span>
            <h1>Your calm <span>college friend</span> for heavy days.</h1>
            <p>
              MindMate is here to listen when you feel stressed, confused, low, or just mentally tired.
              You can vent, reflect, or ask for small next steps without pressure.
            </p>
            <div class="chips">
              <span class="chip">No judgment</span>
              <span class="chip">Student-friendly language</span>
              <span class="chip">Small practical suggestions</span>
              <span class="chip">Private support space</span>
            </div>
          </aside>

          <section class="chat-card">
            <div class="chat-header">
              <h2>Talk with MindMate</h2>
              <p>Share what is on your mind. You can be casual, honest, messy, or unsure.</p>
            </div>

            <div class="messages">
              <div class="bubble assistant" *ngFor="let message of messages" [class.user]="message.role === 'user'" [class.assistant]="message.role === 'assistant'">
                {{ message.content }}
              </div>
            </div>

            <div class="composer">
              <div class="quick-prompts">
                <button type="button" (click)="sendPrompt('I feel stressed about studies and I cannot focus.')">Study stress</button>
                <button type="button" (click)="sendPrompt('I feel lonely even when I am around people.')">Feeling lonely</button>
                <button type="button" (click)="sendPrompt('I keep overthinking small things and it is tiring.')">Overthinking</button>
              </div>
              <form class="compose-row" (ngSubmit)="onComposerSubmit($event)">
                <textarea
                  [(ngModel)]="draft"
                  name="mindmateDraft"
                  placeholder="Type what you are feeling..."
                  (keydown.enter)="handleComposerKeydown($event)"></textarea>
                <button class="send-btn" type="submit" [disabled]="!draft.trim() || sending">{{ sending ? 'Sending...' : 'Send' }}</button>
              </form>
              <div class="note">MindMate is supportive, but it is not a replacement for urgent or professional emergency care.</div>
            </div>
          </section>
        </section>
      </div>

      <app-footer></app-footer>
    </div>
  `
})
export class MindmateComponent {
  private readonly dataService = inject(DataService);
  private requestCounter = 0;

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Hey, I am MindMate. I am here with you. What has been feeling heavy lately?'
    }
  ];
  draft = '';
  sending = false;

  sendPrompt(text: string): void {
    this.send(text);
  }

  handleComposerKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      event.preventDefault();
      const form = (event.target as HTMLTextAreaElement | null)?.form;
      form?.requestSubmit();
    }
  }

  onComposerSubmit(event?: Event): void {
    event?.preventDefault();
    this.send();
  }

  send(overrideContent?: string): void {
    const content = (overrideContent ?? this.draft).trim();
    if (!content || this.sending) return;

    const requestId = ++this.requestCounter;
    const nextMessages: ChatMessage[] = [
      ...this.messages,
      { role: 'user', content }
    ];
    const placeholderIndex = nextMessages.length;

    this.messages = [
      ...nextMessages,
      { role: 'assistant', content: '...' }
    ];
    this.draft = '';
    this.sending = true;

    this.dataService.chatWithMindmate(nextMessages)
      .pipe(timeout(15000))
      .subscribe({
        next: ({ reply }) => {
          if (requestId !== this.requestCounter) return;

          this.messages = this.messages.map((msg, index) =>
            index === placeholderIndex
              ? { role: 'assistant', content: reply }
              : msg
          );
          this.sending = false;
        },
        error: (error: any) => {
          if (requestId !== this.requestCounter) return;

          this.messages = this.messages.map((msg, index) =>
            index === placeholderIndex
              ? {
                role: 'assistant',
                content:
                  error?.error?.message ||
                  'Reply aane me problem ho rahi thi, thoda slow lag raha hai. Deep breath lo... jo sabse heavy lag raha hai usko ek line me batao.'
              }
              : msg
          );
          this.sending = false;
        }
      });
  }
}
