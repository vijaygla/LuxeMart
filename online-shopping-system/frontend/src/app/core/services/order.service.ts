import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CheckoutRequest } from '../../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/order';

  checkout(request: CheckoutRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/checkout`, request);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/my-orders`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${id}`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/all`);
  }

  updateOrderStatus(orderId: number, status: string, paymentStatus?: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}/status`, {
      status,
      payment_status: paymentStatus
    });
  }
}
