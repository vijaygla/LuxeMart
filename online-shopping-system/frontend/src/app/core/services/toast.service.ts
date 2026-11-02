import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3500): void {
    const id = ++this.counter;
    this.toasts.update((items) => [...items, { id, message, type }]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  success(message: string, duration: number = 3500): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration: number = 4000): void {
    this.show(message, 'error', duration);
  }

  info(message: string, duration: number = 3500): void {
    this.show(message, 'info', duration);
  }

  remove(id: number): void {
    this.toasts.update((items) => items.filter((t) => t.id !== id));
  }
}
