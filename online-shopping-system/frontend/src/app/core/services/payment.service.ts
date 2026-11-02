import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRequest } from '../../models/order.model';

export interface PaymentResult {
  success: boolean;
  transaction_reference: string;
  order_id: number;
  amount: number;
  status: string;
  message: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private http = inject(HttpClient);
  private baseUrl = 'http://127.0.0.1:8000/api/v1/payment';

  processPayment(request: PaymentRequest): Observable<PaymentResult> {
    return this.http.post<PaymentResult>(`${this.baseUrl}/process`, request);
  }
}
