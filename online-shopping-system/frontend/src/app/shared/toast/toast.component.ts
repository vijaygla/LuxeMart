import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="toastService.toasts().length > 0">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast-item"
        [ngClass]="'toast-' + toast.type"
        (click)="toastService.remove(toast.id)"
      >
        <i class="ri-checkbox-circle-fill" *ngIf="toast.type === 'success'"></i>
        <i class="ri-error-warning-fill" *ngIf="toast.type === 'error'"></i>
        <i class="ri-information-fill" *ngIf="toast.type === 'info'"></i>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close"><i class="ri-close-line"></i></button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 400px;
    }
    .toast-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      border-radius: var(--radius-md);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      box-shadow: var(--shadow-lg);
      color: var(--text-main);
      font-size: 0.9rem;
      cursor: pointer;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &.toast-success {
        border-left: 4px solid var(--accent-emerald);
        i { color: var(--accent-emerald); font-size: 1.2rem; }
      }
      &.toast-error {
        border-left: 4px solid var(--accent-rose);
        i { color: var(--accent-rose); font-size: 1.2rem; }
      }
      &.toast-info {
        border-left: 4px solid var(--accent-primary);
        i { color: var(--accent-primary); font-size: 1.2rem; }
      }
    }
    .toast-message {
      flex: 1;
      font-weight: 500;
    }
    .toast-close {
      background: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1.1rem;
      &:hover { color: var(--text-main); }
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
