import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ChatMessage, ChatResponse, AvailableModelsResponse } from '../../models/ai.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/ai';

  readonly chatOpen = signal<boolean>(false);
  readonly selectedModel = signal<string>('openai.gpt-5');
  readonly availableModels = signal<string[]>([
    'openai.gpt-5',
    'phi-4-mini-reasoning',
    'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
    'mistral.mistral-7b-instruct-v0:2'
  ]);
  readonly messages = signal<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am your AI Shopping Assistant. How can I help you find products, check stock, or track orders today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  readonly isLoading = signal<boolean>(false);

  loadModels(): Observable<AvailableModelsResponse> {
    return this.http.get<AvailableModelsResponse>(`${this.baseUrl}/models`).pipe(
      tap((res) => {
        this.availableModels.set(res.models);
        if (!this.selectedModel()) {
          this.selectedModel.set(res.default_model);
        }
      })
    );
  }

  toggleChat(): void {
    this.chatOpen.update((v) => !v);
  }

  openChat(): void {
    this.chatOpen.set(true);
  }

  closeChat(): void {
    this.chatOpen.set(false);
  }

  sendMessage(userText: string): void {
    const trimmed = userText.trim();
    if (!trimmed || this.isLoading()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { role: 'user', content: trimmed, time: timeStr };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.isLoading.set(true);

    const historyPayload = this.messages().map((m) => ({
      role: m.role,
      content: m.content
    }));

    this.http.post<ChatResponse>(`${this.baseUrl}/chat`, {
      message: trimmed,
      model_name: this.selectedModel(),
      history: historyPayload
    }).subscribe({
      next: (res) => {
        const assistantMsg: ChatMessage = {
          role: 'assistant',
          content: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggested_products: res.suggested_products
        };
        this.messages.update((msgs) => [...msgs, assistantMsg]);
        this.isLoading.set(false);
      },
      error: (err) => {
        const errorMsg: ChatMessage = {
          role: 'assistant',
          content: 'Sorry, I encountered an issue reaching the AI service. Please try again or switch model.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        this.messages.update((msgs) => [...msgs, errorMsg]);
        this.isLoading.set(false);
      }
    });
  }
}
