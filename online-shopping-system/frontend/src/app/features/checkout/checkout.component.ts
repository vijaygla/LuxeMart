import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page container">
      <!-- Checkout Header -->
      <div class="checkout-header">
        <h1>Secure Checkout</h1>
        <p>Complete your delivery consignment and select preferred payment gateway.</p>
      </div>

      <!-- Success View if Order Placed -->
      <div class="order-success-card glass-card" *ngIf="placedOrder; else checkoutFormTpl">
        <div class="success-icon-wrap">
          <i class="ri-checkbox-circle-fill"></i>
        </div>
        <h2>Consignment Confirmed!</h2>
        <p class="order-num-text">Order Reference: <strong>#{{ placedOrder.order_number }}</strong></p>
        <p class="success-sub">
          A receipt and delivery tracker have been dispatched to <strong>{{ authService.currentUser()?.email }}</strong>.
        </p>

        <div class="success-summary glass-card">
          <div class="summary-line">
            <span>Payment Method</span>
            <strong>{{ placedOrder.payment_method }} ({{ placedOrder.payment_status }})</strong>
          </div>
          <div class="summary-line">
            <span>Total Debited</span>
            <strong>\${{ placedOrder.total_amount | number:'1.2-2' }}</strong>
          </div>
          <div class="summary-line">
            <span>Shipping Address</span>
            <span>{{ placedOrder.shipping_address }}, {{ placedOrder.shipping_city }}</span>
          </div>
        </div>

        <div class="success-actions">
          <a routerLink="/orders" class="btn btn-primary btn-lg">
            <i class="ri-truck-line"></i> View & Track Orders
          </a>
          <a routerLink="/catalog" class="btn btn-outline btn-lg">
            Continue Browsing
          </a>
        </div>
      </div>

      <!-- Checkout Form Template -->
      <ng-template #checkoutFormTpl>
        <div class="checkout-grid" *ngIf="cartService.cart()?.items && cartService.cart()!.items.length > 0; else noCartTpl">
          <!-- Left: Forms -->
          <div class="forms-col">
            <!-- 1. Shipping Address Section -->
            <div class="form-section glass-card">
              <div class="section-title">
                <span class="step-num">1</span>
                <h3>Delivery Consignment Details</h3>
              </div>

              <div class="form-row">
                <div class="form-group col-12">
                  <label>Full Recipient Name *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingName"
                    placeholder="e.g. Rohan Verma"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-12">
                  <label>Street Address *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingAddress"
                    placeholder="Suite, apartment, street address"
                  />
                </div>
              </div>

              <div class="form-row grid-3">
                <div class="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingCity"
                    placeholder="City"
                  />
                </div>
                <div class="form-group">
                  <label>State / Region</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingState"
                    placeholder="State"
                  />
                </div>
                <div class="form-group">
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingPostalCode"
                    placeholder="Postal Code"
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-12">
                  <label>Contact Phone Number *</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="shippingPhone"
                    placeholder="+1 (555) 000-0000 or +91 9876543210"
                  />
                </div>
              </div>
            </div>

            <!-- 2. Payment Gateway Section -->
            <div class="form-section glass-card">
              <div class="section-title">
                <span class="step-num">2</span>
                <h3>Payment Method</h3>
              </div>

              <div class="payment-methods-grid">
                <div
                  class="method-card"
                  [class.selected]="selectedMethod === 'Credit Card'"
                  (click)="selectedMethod = 'Credit Card'"
                >
                  <i class="ri-bank-card-line"></i>
                  <span>Credit Card</span>
                </div>
                <div
                  class="method-card"
                  [class.selected]="selectedMethod === 'UPI'"
                  (click)="selectedMethod = 'UPI'"
                >
                  <i class="ri-qr-code-line"></i>
                  <span>UPI / QR</span>
                </div>
                <div
                  class="method-card"
                  [class.selected]="selectedMethod === 'Net Banking'"
                  (click)="selectedMethod = 'Net Banking'"
                >
                  <i class="ri-bank-line"></i>
                  <span>Net Banking</span>
                </div>
                <div
                  class="method-card"
                  [class.selected]="selectedMethod === 'COD'"
                  (click)="selectedMethod = 'COD'"
                >
                  <i class="ri-hand-coin-line"></i>
                  <span>Cash on Delivery</span>
                </div>
              </div>

              <!-- Card Details Form -->
              <div class="card-inputs-box" *ngIf="selectedMethod === 'Credit Card'">
                <div class="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="cardNumber"
                    placeholder="4111 2222 3333 4444"
                  />
                </div>
                <div class="form-row grid-3">
                  <div class="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="cardHolder"
                      placeholder="Name on card"
                    />
                  </div>
                  <div class="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      type="text"
                      class="form-control"
                      [(ngModel)]="cardExpiry"
                      placeholder="12/28"
                    />
                  </div>
                  <div class="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      class="form-control"
                      [(ngModel)]="cardCvv"
                      placeholder="123"
                      maxlength="4"
                    />
                  </div>
                </div>
              </div>

              <!-- UPI Details Form -->
              <div class="card-inputs-box" *ngIf="selectedMethod === 'UPI'">
                <div class="form-group">
                  <label>Virtual Payment Address (UPI ID)</label>
                  <input
                    type="text"
                    class="form-control"
                    [(ngModel)]="upiId"
                    placeholder="username@okhdfcbank or @upi"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Order Summary Sidebar -->
          <div class="summary-col">
            <div class="checkout-summary-card glass-card">
              <h3>Items in Consignment</h3>

              <div class="checkout-items-list">
                <div class="checkout-item" *ngFor="let item of cartService.cart()?.items">
                  <img [src]="item.product?.image_url" [alt]="item.product?.name" />
                  <div class="item-name-wrap">
                    <p class="name">{{ item.product?.name }}</p>
                    <span class="qty">Qty: {{ item.quantity }} &times; \${{ item.unit_price | number:'1.2-2' }}</span>
                  </div>
                  <span class="total">\${{ item.total_price | number:'1.2-2' }}</span>
                </div>
              </div>

              <div class="summary-divider"></div>

              <div class="summary-line">
                <span>Subtotal</span>
                <strong>\${{ cartService.subtotal() | number:'1.2-2' }}</strong>
              </div>
              <div class="summary-line" *ngIf="cartService.cart()?.discount">
                <span>Discount</span>
                <strong style="color: var(--accent-emerald);">-\${{ cartService.cart()?.discount | number:'1.2-2' }}</strong>
              </div>
              <div class="summary-line">
                <span>Shipping</span>
                <strong>{{ cartService.cart()?.shipping_fee === 0 ? 'FREE' : ('$' + (cartService.cart()?.shipping_fee | number:'1.2-2')) }}</strong>
              </div>
              <div class="summary-line">
                <span>Tax</span>
                <strong>\${{ cartService.cart()?.estimated_tax | number:'1.2-2' }}</strong>
              </div>

              <div class="summary-divider"></div>

              <div class="total-line">
                <span>Grand Total</span>
                <span class="total-num">\${{ cartService.total() | number:'1.2-2' }}</span>
              </div>

              <button
                class="btn btn-gold btn-lg place-order-btn"
                [disabled]="isSubmitting"
                (click)="placeOrder()"
              >
                <i class="ri-shield-check-line" *ngIf="!isSubmitting"></i>
                <span *ngIf="isSubmitting">Authorizing Payment...</span>
                <span *ngIf="!isSubmitting">Authorize & Place Order</span>
              </button>
            </div>
          </div>
        </div>

        <ng-template #noCartTpl>
          <div class="empty-checkout glass-card">
            <h2>Your bag is empty</h2>
            <p>Please add luxury items to your cart before proceeding to checkout.</p>
            <a routerLink="/catalog" class="btn btn-primary">Browse Catalogue</a>
          </div>
        </ng-template>
      </ng-template>
    </div>
  `,
  styles: [`
    .checkout-page {
      padding-top: 3rem;
      padding-bottom: 5rem;
      min-height: 80vh;
    }

    .checkout-header {
      margin-bottom: 2.5rem;
      h1 { font-size: 2.2rem; }
      p { color: var(--text-muted); font-size: 1rem; margin-top: 0.25rem; }
    }

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
      align-items: start;
    }

    .forms-col {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-section {
      padding: 2rem;

      .section-title {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;

        .step-num {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: #fff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        h3 { font-size: 1.25rem; }
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;

      &.grid-3 {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
      }

      .col-12 { flex: 1; }
    }

    .payment-methods-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;

      .method-card {
        padding: 1.25rem 0.75rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
        transition: var(--transition);

        i { font-size: 1.6rem; color: var(--text-dim); }
        span { font-size: 0.8rem; font-weight: 600; color: var(--text-muted); }

        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.2);
        }

        &.selected {
          border-color: var(--accent-gold);
          background: rgba(245, 158, 11, 0.1);
          i { color: var(--accent-gold); }
          span { color: #fff; }
        }
      }
    }

    .card-inputs-box {
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
    }

    .checkout-summary-card {
      padding: 1.75rem;

      h3 { font-size: 1.2rem; margin-bottom: 1.25rem; }

      .checkout-items-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 280px;
        overflow-y: auto;
        padding-right: 0.5rem;

        .checkout-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          img {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-sm);
            object-fit: cover;
          }

          .item-name-wrap {
            flex: 1;
            .name { font-size: 0.85rem; font-weight: 600; color: #fff; line-height: 1.2; }
            .qty { font-size: 0.75rem; color: var(--text-dim); }
          }

          .total {
            font-size: 0.95rem;
            font-weight: 700;
            color: #fff;
          }
        }
      }

      .summary-divider {
        height: 1px;
        background: var(--border-subtle);
        margin: 1.25rem 0;
      }

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--text-muted);
        margin-bottom: 0.6rem;

        strong { color: #fff; }
      }

      .total-line {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin: 1.25rem 0;

        span { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .total-num {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent-gold);
        }
      }

      .place-order-btn {
        width: 100%;
      }
    }

    .order-success-card {
      max-width: 650px;
      margin: 2rem auto;
      padding: 3rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      .success-icon-wrap i {
        font-size: 4.5rem;
        color: var(--accent-emerald);
      }

      h2 { font-size: 2rem; }
      .order-num-text { font-size: 1.1rem; color: var(--accent-gold); }
      .success-sub { color: var(--text-muted); font-size: 0.95rem; max-width: 480px; }

      .success-summary {
        width: 100%;
        margin: 1.5rem 0;
        padding: 1.25rem;
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-muted);
          strong, span:last-child { color: #fff; }
        }
      }

      .success-actions {
        display: flex;
        gap: 1rem;
      }
    }

    .empty-checkout {
      text-align: center;
      padding: 4rem 2rem;
      h2 { margin-bottom: 0.5rem; }
      p { color: var(--text-muted); margin-bottom: 1.5rem; }
    }

    @media (max-width: 900px) {
      .checkout-grid { grid-template-columns: 1fr; }
      .payment-methods-grid { grid-template-columns: repeat(2, 1fr); }
      .form-row.grid-3 { grid-template-columns: 1fr; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);

  // Form Fields
  shippingName = '';
  shippingAddress = '';
  shippingCity = '';
  shippingState = '';
  shippingPostalCode = '';
  shippingPhone = '';

  selectedMethod = 'Credit Card';
  cardNumber = '4111 2222 3333 4444';
  cardHolder = '';
  cardExpiry = '12/28';
  cardCvv = '123';
  upiId = 'customer@okhdfcbank';

  isSubmitting = false;
  placedOrder: Order | null = null;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.shippingName = user.name;
      this.cardHolder = user.name;
    }
    this.cartService.loadCart().subscribe();
  }

  placeOrder(): void {
    if (!this.shippingName.trim() || !this.shippingAddress.trim() || !this.shippingCity.trim() || !this.shippingPhone.trim()) {
      this.toastService.error('Please complete all required delivery fields.');
      return;
    }

    this.isSubmitting = true;
    this.orderService.checkout({
      shipping_name: this.shippingName.trim(),
      shipping_address: this.shippingAddress.trim(),
      shipping_city: this.shippingCity.trim(),
      shipping_state: this.shippingState.trim(),
      shipping_postal_code: this.shippingPostalCode.trim() || '10001',
      shipping_phone: this.shippingPhone.trim(),
      payment_method: this.selectedMethod
    }).subscribe({
      next: (order) => {
        // Execute instant payment
        this.paymentService.processPayment({
          order_id: order.id,
          payment_method: this.selectedMethod,
          card_number: this.cardNumber,
          card_holder: this.cardHolder,
          expiry: this.cardExpiry,
          cvv: this.cardCvv,
          upi_id: this.upiId
        }).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.placedOrder = order;
            this.cartService.loadCart().subscribe(); // refresh empty cart
            this.toastService.success(`Order #${order.order_number} confirmed!`);
          },
          error: (err) => {
            this.isSubmitting = false;
            this.placedOrder = order; // order created, payment pending
            this.toastService.info('Order registered. Payment marked as pending.');
          }
        });
      },
      error: (err) => {
        this.isSubmitting = false;
        this.toastService.error(err.error?.detail || 'Failed to complete order.');
      }
    });
  }
}
