import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { CartItem } from '../../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page container">
      <div class="cart-header">
        <h1>Your Shopping Bag</h1>
        <p *ngIf="cartService.itemCount() > 0">
          You have <strong>{{ cartService.itemCount() }}</strong> curated item(s) in your bag.
        </p>
      </div>

      <!-- Free Shipping Progress Tracker -->
      <div class="shipping-tracker glass-card" *ngIf="cartService.itemCount() > 0">
        <div class="tracker-text">
          <span *ngIf="cartService.subtotal() >= 100">
            <i class="ri-checkbox-circle-fill success-icon"></i> You qualify for <strong>Complimentary Express Shipping!</strong>
          </span>
          <span *ngIf="cartService.subtotal() < 100">
            Add <strong>\${{ (100 - cartService.subtotal()) | number:'1.2-2' }}</strong> more to unlock <strong>Free Express Shipping</strong>.
          </span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" [style.width.%]="getShippingProgress()"></div>
        </div>
      </div>

      <!-- Cart Content Grid -->
      <div class="cart-layout" *ngIf="cartService.cart()?.items && cartService.cart()!.items.length > 0; else emptyCartTpl">
        <!-- Items Table -->
        <div class="items-column">
          <div class="cart-items-card glass-card">
            <div class="cart-item-row" *ngFor="let item of cartService.cart()?.items">
              <!-- Item Image -->
              <img [src]="item.product?.image_url" [alt]="item.product?.name" class="item-img" />

              <!-- Item Info -->
              <div class="item-info">
                <span class="item-category">{{ item.product?.category_name }}</span>
                <a [routerLink]="['/product', item.product_id]" class="item-name">{{ item.product?.name }}</a>
                <span class="unit-price">\${{ item.unit_price | number:'1.2-2' }} each</span>
              </div>

              <!-- Quantity Controls -->
              <div class="qty-box">
                <button (click)="updateQty(item, item.quantity - 1)" [disabled]="item.quantity <= 1">
                  <i class="ri-subtract-line"></i>
                </button>
                <span>{{ item.quantity }}</span>
                <button (click)="updateQty(item, item.quantity + 1)">
                  <i class="ri-add-line"></i>
                </button>
              </div>

              <!-- Line Total -->
              <div class="line-total">
                \${{ item.total_price | number:'1.2-2' }}
              </div>

              <!-- Remove -->
              <button class="remove-btn" (click)="removeItem(item.id)" title="Remove item">
                <i class="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>

          <!-- Bottom Action Buttons -->
          <div class="cart-actions-row">
            <a routerLink="/catalog" class="btn btn-outline btn-sm">
              <i class="ri-arrow-left-line"></i> Continue Shopping
            </a>
            <button class="btn btn-outline btn-sm text-danger" (click)="clearCart()">
              <i class="ri-delete-bin-2-line"></i> Clear Bag
            </button>
          </div>
        </div>

        <!-- Summary Column -->
        <div class="summary-column">
          <div class="order-summary-card glass-card">
            <h3>Order Summary</h3>

            <div class="summary-line">
              <span>Bag Subtotal</span>
              <span class="val">\${{ cartService.subtotal() | number:'1.2-2' }}</span>
            </div>

            <div class="summary-line" *ngIf="cartService.cart()?.discount">
              <span>Bespoke Discount (5%)</span>
              <span class="val discount-val">-\${{ cartService.cart()?.discount | number:'1.2-2' }}</span>
            </div>

            <div class="summary-line">
              <span>Estimated Shipping</span>
              <span class="val" *ngIf="cartService.cart()?.shipping_fee === 0" style="color: var(--accent-emerald);">FREE</span>
              <span class="val" *ngIf="cartService.cart()?.shipping_fee! > 0">\${{ cartService.cart()?.shipping_fee | number:'1.2-2' }}</span>
            </div>

            <div class="summary-line">
              <span>Estimated Sales Tax (8%)</span>
              <span class="val">\${{ cartService.cart()?.estimated_tax | number:'1.2-2' }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-total-line">
              <span>Total Investment</span>
              <span class="total-val">\${{ cartService.total() | number:'1.2-2' }}</span>
            </div>

            <button class="btn btn-primary btn-lg checkout-btn" (click)="proceedToCheckout()">
              <i class="ri-lock-2-line"></i> Proceed to Secure Checkout
            </button>

            <!-- Trust Seals -->
            <div class="summary-assurances">
              <div class="seal"><i class="ri-shield-check-fill"></i> 256-Bit SSL Encrypted</div>
              <div class="seal"><i class="ri-refund-2-line"></i> 30-Day Money-Back Guarantee</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty Cart State -->
      <ng-template #emptyCartTpl>
        <div class="empty-cart glass-card">
          <i class="ri-shopping-bag-line empty-icon"></i>
          <h2>Your shopping bag is currently empty</h2>
          <p>Explore our seasonal curated collections of luxury tech, couture, and home design.</p>
          <a routerLink="/catalog" class="btn btn-primary btn-lg">
            <i class="ri-compass-3-line"></i> Explore Catalog
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page {
      padding-top: 3rem;
      padding-bottom: 5rem;
      min-height: 80vh;
    }

    .cart-header {
      margin-bottom: 2rem;
      h1 { font-size: 2.2rem; }
      p { color: var(--text-muted); font-size: 1rem; margin-top: 0.25rem; }
    }

    .shipping-tracker {
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      background: linear-gradient(90deg, rgba(99, 102, 241, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%);
      border: 1px solid rgba(99, 102, 241, 0.25);

      .tracker-text {
        font-size: 0.92rem;
        margin-bottom: 0.6rem;
        color: var(--text-main);
        .success-icon { color: var(--accent-emerald); font-size: 1.1rem; }
      }

      .progress-bar-bg {
        height: 6px;
        background: rgba(255, 255, 255, 0.08);
        border-radius: var(--radius-full);
        overflow: hidden;

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #6366f1 0%, #10b981 100%);
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }
      }
    }

    .cart-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
      align-items: start;
    }

    .cart-items-card {
      padding: 0.5rem 1.5rem;
    }

    .cart-item-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem 0;
      border-bottom: 1px solid var(--border-subtle);

      &:last-child { border-bottom: none; }

      .item-img {
        width: 80px;
        height: 80px;
        border-radius: var(--radius-sm);
        object-fit: cover;
      }

      .item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .item-category {
          font-size: 0.72rem;
          color: var(--accent-gold);
          font-weight: 700;
          text-transform: uppercase;
        }

        .item-name {
          font-weight: 600;
          font-size: 1rem;
          color: #fff;
          line-height: 1.3;
          &:hover { color: var(--accent-primary); }
        }

        .unit-price {
          font-size: 0.85rem;
          color: var(--text-dim);
        }
      }

      .qty-box {
        display: flex;
        align-items: center;
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);

        button {
          background: none;
          color: #fff;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
          &:disabled { opacity: 0.3; cursor: not-allowed; }
        }

        span {
          width: 36px;
          text-align: center;
          font-weight: 700;
          font-size: 0.95rem;
        }
      }

      .line-total {
        font-family: var(--font-heading);
        font-size: 1.2rem;
        font-weight: 700;
        color: #fff;
        min-width: 90px;
        text-align: right;
      }

      .remove-btn {
        background: none;
        color: var(--text-dim);
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0.4rem;
        border-radius: var(--radius-sm);
        &:hover { color: var(--accent-rose); background: rgba(244, 63, 94, 0.1); }
      }
    }

    .cart-actions-row {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
    }

    .order-summary-card {
      padding: 1.75rem;

      h3 { font-size: 1.25rem; margin-bottom: 1.5rem; }

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.92rem;
        color: var(--text-muted);
        margin-bottom: 0.85rem;

        .val { font-weight: 600; color: #fff; }
        .discount-val { color: var(--accent-emerald); font-weight: 700; }
      }

      .summary-divider {
        height: 1px;
        background: var(--border-subtle);
        margin: 1.25rem 0;
      }

      .summary-total-line {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 1.5rem;

        span { font-size: 1.1rem; font-weight: 700; color: #fff; }
        .total-val {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--accent-gold);
        }
      }

      .checkout-btn {
        width: 100%;
        margin-bottom: 1.25rem;
      }

      .summary-assurances {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 1rem;

        .seal {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.78rem;
          color: var(--text-dim);
          i { color: var(--accent-primary); }
        }
      }
    }

    .empty-cart {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      max-width: 600px;
      margin: 2rem auto;

      .empty-icon {
        font-size: 4.5rem;
        color: var(--text-dim);
      }

      h2 { font-size: 1.6rem; }
      p { color: var(--text-muted); margin-bottom: 0.5rem; }
    }

    @media (max-width: 900px) {
      .cart-layout { grid-template-columns: 1fr; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartService = inject(CartService);
  toastService = inject(ToastService);
  router = inject(Router);

  ngOnInit(): void {
    this.cartService.loadCart().subscribe({
      error: () => {
        // user not authenticated or cart empty
      }
    });
  }

  getShippingProgress(): number {
    const sub = this.cartService.subtotal();
    return Math.min(100, Math.round((sub / 100) * 100));
  }

  updateQty(item: CartItem, newQty: number): void {
    if (newQty < 1) return;
    this.cartService.updateQuantity(item.id, newQty).subscribe({
      next: () => {
        this.toastService.success('Bag updated.');
      },
      error: () => {
        this.toastService.error('Failed to update quantity.');
      }
    });
  }

  removeItem(itemId: number): void {
    this.cartService.removeItem(itemId).subscribe({
      next: () => {
        this.toastService.info('Item removed from your bag.');
      },
      error: () => {
        this.toastService.error('Failed to remove item.');
      }
    });
  }

  clearCart(): void {
    this.cartService.clearCart().subscribe({
      next: () => {
        this.toastService.info('Shopping bag emptied.');
      }
    });
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
