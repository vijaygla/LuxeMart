import { Component, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiService } from '../../core/services/ai.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-ai-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Launcher Button -->
    <button
      class="ai-chat-launcher"
      [class.active]="aiService.chatOpen()"
      (click)="aiService.toggleChat()"
      title="Open AI Shopping Concierge"
    >
      <div class="glow-ring"></div>
      <i class="ri-sparkling-fill launcher-icon" *ngIf="!aiService.chatOpen()"></i>
      <i class="ri-close-line launcher-icon" *ngIf="aiService.chatOpen()"></i>
      <span class="launcher-label" *ngIf="!aiService.chatOpen()">AI Concierge</span>
    </button>

    <!-- Chat Drawer / Modal Container -->
    <div class="chat-drawer" *ngIf="aiService.chatOpen()">
      <!-- Chat Header -->
      <div class="chat-header">
        <div class="header-left">
          <div class="avatar-ai">
            <i class="ri-robot-2-line"></i>
          </div>
          <div>
            <h3>LuxeMart AI Concierge</h3>
            <span class="status-indicator"><span class="dot"></span> Real-time Live Catalog Grounded</span>
          </div>
        </div>

        <div class="header-actions">
          <button class="icon-btn" (click)="aiService.closeChat()">
            <i class="ri-close-line"></i>
          </button>
        </div>
      </div>

      <!-- Model Selector Bar -->
      <div class="model-selector-bar">
        <div class="model-info">
          <i class="ri-cpu-line"></i>
          <label>Engine Model:</label>
        </div>
        <select
          class="model-select"
          [ngModel]="aiService.selectedModel()"
          (ngModelChange)="onModelChange($event)"
        >
          <option value="openai.gpt-5">OpenAI GPT-5 (Flagship)</option>
          <option value="phi-4-mini-reasoning">Phi-4 Mini Reasoning</option>
          <option value="us.anthropic.claude-sonnet-4-5-20250929-v1:0">Claude Sonnet 4.5</option>
          <option value="mistral.mistral-7b-instruct-v0:2">Mistral 7B Instruct</option>
        </select>
      </div>

      <!-- Quick Suggestion Chips -->
      <div class="quick-chips">
        <button (click)="sendQuickPrompt('What are your best noise-cancelling headphones?')">
          🎧 Best Headphones
        </button>
        <button (click)="sendQuickPrompt('Do you have luxury espresso machines in stock?')">
          ☕ Espresso Machines
        </button>
        <button (click)="sendQuickPrompt('What is your return & shipping policy?')">
          📦 Shipping Policy
        </button>
        <button (click)="sendQuickPrompt('Can you recommend an anniversary luxury gift?')">
          ✨ Luxury Gifts
        </button>
      </div>

      <!-- Chat Messages Scroll Area -->
      <div class="chat-messages" #scrollContainer>
        <div
          *ngFor="let msg of aiService.messages()"
          class="chat-bubble"
          [ngClass]="msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'"
        >
          <div class="bubble-header" *ngIf="msg.role === 'assistant'">
            <i class="ri-sparkling-line"></i> LuxeMart AI
            <span class="bubble-time">{{ msg.time }}</span>
          </div>

          <div class="bubble-content" [innerHTML]="formatMessage(msg.content)"></div>

          <!-- Suggested Product Cards Grid if returned from DB -->
          <div class="suggested-products-grid" *ngIf="msg.suggested_products && msg.suggested_products.length > 0">
            <div
              *ngFor="let prod of msg.suggested_products"
              class="suggested-card"
              (click)="navigateToProduct(prod.id)"
            >
              <img [src]="prod.image_url" [alt]="prod.name" />
              <div class="suggested-details">
                <p class="suggested-name">{{ prod.name }}</p>
                <div class="suggested-price-row">
                  <span class="price">\${{ (prod.discount_price || prod.price) | number:'1.2-2' }}</span>
                  <span class="stock-badge" [class.low]="prod.stock_quantity <= 10">
                    {{ prod.stock_quantity > 0 ? prod.stock_quantity + ' in stock' : 'Out of stock' }}
                  </span>
                </div>
                <button class="quick-add-btn" (click)="quickAddToCart($event, prod)">
                  <i class="ri-shopping-cart-line"></i> Add
                </button>
              </div>
            </div>
          </div>

          <div class="bubble-time-user" *ngIf="msg.role === 'user'">
            {{ msg.time }}
          </div>
        </div>

        <!-- Typing Loading Indicator -->
        <div class="typing-indicator" *ngIf="aiService.isLoading()">
          <div class="dot-flashing"></div>
          <span>Consulting live database catalog...</span>
        </div>
      </div>

      <!-- Input Area -->
      <div class="chat-input-area">
        <input
          type="text"
          placeholder="Ask anything about products, orders, stock..."
          [(ngModel)]="userInput"
          (keyup.enter)="sendMessage()"
          [disabled]="aiService.isLoading()"
        />
        <button
          class="send-btn"
          (click)="sendMessage()"
          [disabled]="!userInput.trim() || aiService.isLoading()"
        >
          <i class="ri-send-plane-2-fill"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ai-chat-launcher {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1500;
      height: 54px;
      padding: 0 1.25rem;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #6366f1 0%, #ec4899 50%, #f59e0b 100%);
      background-size: 200% 200%;
      animation: gradientShift 4s ease infinite;
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      transition: var(--transition);

      &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 12px 35px rgba(236, 72, 153, 0.6);
      }

      .launcher-icon {
        font-size: 1.4rem;
      }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .chat-drawer {
      position: fixed;
      bottom: 6rem;
      right: 2rem;
      width: 440px;
      max-width: calc(100vw - 2.5rem);
      height: 620px;
      max-height: calc(100vh - 8rem);
      background: var(--bg-surface);
      border: 1px solid var(--border-accent);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      z-index: 1500;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from { transform: translateY(20px) scale(0.96); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }

    .chat-header {
      padding: 1rem 1.25rem;
      background: rgba(11, 15, 25, 0.85);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .avatar-ai {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        h3 {
          font-size: 1rem;
          margin-bottom: 0.1rem;
        }

        .status-indicator {
          font-size: 0.72rem;
          color: var(--accent-emerald);
          display: flex;
          align-items: center;
          gap: 0.35rem;

          .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--accent-emerald);
            box-shadow: 0 0 8px var(--accent-emerald);
          }
        }
      }

      .icon-btn {
        background: none;
        color: var(--text-muted);
        font-size: 1.3rem;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: var(--radius-sm);
        &:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }
      }
    }

    .model-selector-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      background: rgba(0, 0, 0, 0.35);
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.8rem;

      .model-info {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--accent-gold);
        font-weight: 600;
      }

      .model-select {
        background: var(--bg-card);
        color: #fff;
        padding: 0.25rem 0.6rem;
        border-radius: var(--radius-sm);
        border: 1px solid var(--border-subtle);
        font-size: 0.78rem;
        cursor: pointer;
        &:focus { border-color: var(--accent-primary); }
      }
    }

    .quick-chips {
      display: flex;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      overflow-x: auto;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid var(--border-subtle);

      button {
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-muted);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full);
        padding: 0.25rem 0.65rem;
        font-size: 0.74rem;
        font-weight: 500;
        cursor: pointer;
        transition: var(--transition);
        &:hover {
          color: #fff;
          background: rgba(99, 102, 241, 0.2);
          border-color: var(--accent-primary);
        }
      }
    }

    .chat-messages {
      flex: 1;
      padding: 1.25rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .chat-bubble {
      max-width: 88%;
      padding: 0.85rem 1.1rem;
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      line-height: 1.5;

      &.bubble-assistant {
        align-self: flex-start;
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: var(--text-main);
        border-bottom-left-radius: 4px;

        .bubble-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--accent-primary);
          font-weight: 700;
          margin-bottom: 0.4rem;
          .bubble-time { margin-left: auto; color: var(--text-dim); font-weight: 400; }
        }
      }

      &.bubble-user {
        align-self: flex-end;
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
        color: #fff;
        border-bottom-right-radius: 4px;

        .bubble-time-user {
          font-size: 0.68rem;
          text-align: right;
          margin-top: 0.3rem;
          opacity: 0.8;
        }
      }
    }

    .suggested-products-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.6rem;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);

      .suggested-card {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background: rgba(11, 15, 25, 0.6);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0.5rem;
        cursor: pointer;
        transition: var(--transition);

        &:hover {
          background: rgba(11, 15, 25, 0.9);
          border-color: var(--accent-primary);
        }

        img {
          width: 48px;
          height: 48px;
          border-radius: 6px;
          object-fit: cover;
        }

        .suggested-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .suggested-name {
            font-size: 0.82rem;
            font-weight: 600;
            color: #fff;
            line-height: 1.2;
          }

          .suggested-price-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            .price { color: var(--accent-gold); font-weight: 700; font-size: 0.85rem; }
            .stock-badge {
              font-size: 0.68rem;
              color: var(--accent-emerald);
              &.low { color: var(--accent-rose); }
            }
          }
        }

        .quick-add-btn {
          padding: 0.35rem 0.65rem;
          background: var(--accent-primary);
          color: #fff;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          &:hover { background: var(--accent-primary-hover); }
        }
      }
    }

    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.82rem;
      color: var(--text-dim);
      padding: 0.5rem;

      .dot-flashing {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: var(--accent-primary);
        animation: dotFlashing 1s infinite alternate;
      }
    }

    @keyframes dotFlashing {
      0% { opacity: 0.2; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1.2); }
    }

    .chat-input-area {
      padding: 0.85rem 1.25rem;
      background: rgba(11, 15, 25, 0.9);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      gap: 0.6rem;

      input {
        flex: 1;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full);
        padding: 0.65rem 1rem;
        color: #fff;
        font-size: 0.88rem;

        &:focus {
          border-color: var(--accent-primary);
          background: rgba(255, 255, 255, 0.08);
        }
      }

      .send-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--accent-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        cursor: pointer;
        transition: var(--transition);

        &:hover:not(:disabled) {
          background: var(--accent-primary-hover);
          transform: scale(1.05);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class AiChatComponent implements AfterViewChecked {
  aiService = inject(AiService);
  cartService = inject(CartService);
  toastService = inject(ToastService);
  router = inject(Router);

  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  userInput = '';

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch {}
    }
  }

  onModelChange(newModel: string): void {
    this.aiService.selectedModel.set(newModel);
    this.toastService.info(`AI Model switched to: ${newModel}`);
  }

  sendQuickPrompt(prompt: string): void {
    this.userInput = prompt;
    this.sendMessage();
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;
    const text = this.userInput;
    this.userInput = '';
    this.aiService.sendMessage(text);
  }

  formatMessage(text: string): string {
    // Simple markdown link & bold formatter
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  }

  navigateToProduct(id: number): void {
    this.aiService.closeChat();
    this.router.navigate(['/product', id]);
  }

  quickAddToCart(event: Event, prod: Product): void {
    event.stopPropagation();
    this.cartService.addToCart(prod.id, 1).subscribe({
      next: () => {
        this.toastService.success(`Added "${prod.name}" to cart!`);
      },
      error: () => {
        this.toastService.error('Failed to add item to cart. Please log in.');
      }
    });
  }
}
