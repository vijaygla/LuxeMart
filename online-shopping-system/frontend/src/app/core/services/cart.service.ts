import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Cart } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/cart';

  readonly cart = signal<Cart | null>(null);
  readonly itemCount = computed(() => this.cart()?.item_count || 0);
  readonly subtotal = computed(() => this.cart()?.subtotal || 0);
  readonly total = computed(() => this.cart()?.total || 0);

  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(this.baseUrl).pipe(
      tap((cart) => this.cart.set(cart))
    );
  }

  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/items`, { product_id: productId, quantity }).pipe(
      tap((cart) => this.cart.set(cart))
    );
  }

  updateQuantity(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/items/${itemId}`, { quantity }).pipe(
      tap((cart) => this.cart.set(cart))
    );
  }

  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/items/${itemId}`).pipe(
      tap((cart) => this.cart.set(cart))
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clear`).pipe(
      tap(() => this.cart.set(null))
    );
  }
}
