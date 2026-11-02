import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-page container">
      <div class="orders-header">
        <h1>My Consignments & Orders</h1>
        <p>Monitor your active acquisitions, delivery tracking, and authenticated purchase history.</p>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="isLoading()">
        <div class="spinner"></div>
        <p>Retrieving client order ledger from database...</p>
      </div>

      <!-- Orders List -->
      <div class="orders-list" *ngIf="!isLoading() && orders().length > 0; else emptyOrdersTpl">
        <div class="order-card glass-card" *ngFor="let order of orders()">
          <!-- Card Header -->
          <div class="order-card-header">
            <div class="order-id-group">
              <span class="ref-label">Consignment</span>
              <strong class="order-num">#{{ order.order_number }}</strong>
              <span class="order-date">{{ order.created_at | date:'mediumDate' }}</span>
            </div>

            <div class="order-status-group">
              <span
                class="badge"
                [ngClass]="{
                  'badge-emerald': order.status === 'Delivered',
                  'badge-indigo': order.status === 'Shipped',
                  'badge-gold': order.status === 'Processing' || order.status === 'Pending',
                  'badge-rose': order.status === 'Cancelled'
                }"
              >
                {{ order.status }}
              </span>
              <span class="total-val">\${{ order.total_amount | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Progress Stepper Timeline -->
          <div class="order-timeline">
            <div class="timeline-step" [class.completed]="isStepCompleted(order.status, 'Pending')">
              <div class="step-icon"><i class="ri-file-list-3-line"></i></div>
              <span>Registered</span>
            </div>
            <div class="timeline-line" [class.completed]="isStepCompleted(order.status, 'Processing')"></div>
            <div class="timeline-step" [class.completed]="isStepCompleted(order.status, 'Processing')">
              <div class="step-icon"><i class="ri-box-3-line"></i></div>
              <span>Processing</span>
            </div>
            <div class="timeline-line" [class.completed]="isStepCompleted(order.status, 'Shipped')"></div>
            <div class="timeline-step" [class.completed]="isStepCompleted(order.status, 'Shipped')">
              <div class="step-icon"><i class="ri-truck-line"></i></div>
              <span>Shipped</span>
            </div>
            <div class="timeline-line" [class.completed]="isStepCompleted(order.status, 'Delivered')"></div>
            <div class="timeline-step" [class.completed]="isStepCompleted(order.status, 'Delivered')">
              <div class="step-icon"><i class="ri-checkbox-circle-line"></i></div>
              <span>Delivered</span>
            </div>
          </div>

          <!-- Items List Inside Order -->
          <div class="order-items-table">
            <div class="order-item-row" *ngFor="let item of order.items">
              <img [src]="item.product_image" [alt]="item.product_name" />
              <div class="item-name-col">
                <a [routerLink]="['/product', item.product_id]" class="name">{{ item.product_name }}</a>
                <span class="qty">Qty: {{ item.quantity }} &times; \${{ item.unit_price | number:'1.2-2' }}</span>
              </div>
              <span class="item-total">\${{ item.total_price | number:'1.2-2' }}</span>
            </div>
          </div>

          <!-- Card Footer Details -->
          <div class="order-card-footer">
            <div class="footer-meta">
              <span><strong>Delivering To:</strong> {{ order.shipping_name }} &bull; {{ order.shipping_address }}, {{ order.shipping_city }}</span>
              <span><strong>Payment:</strong> {{ order.payment_method }} &bull; <em style="color: var(--accent-emerald);">{{ order.payment_status }}</em></span>
            </div>
            <a [routerLink]="['/catalog']" class="btn btn-outline btn-sm">
              <i class="ri-repeat-line"></i> Reorder Items
            </a>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <ng-template #emptyOrdersTpl>
        <div class="empty-orders glass-card" *ngIf="!isLoading()">
          <i class="ri-file-list-line"></i>
          <h2>No orders on record</h2>
          <p>You haven't acquired any luxury consignments yet.</p>
          <a routerLink="/catalog" class="btn btn-primary btn-lg">Browse Collections</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-page {
      padding-top: 3rem;
      padding-bottom: 5rem;
      min-height: 80vh;
    }

    .orders-header {
      margin-bottom: 2.5rem;
      h1 { font-size: 2.2rem; }
      p { color: var(--text-muted); font-size: 1rem; margin-top: 0.25rem; }
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .order-card {
      padding: 1.75rem;

      .order-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 1.25rem;
        border-bottom: 1px solid var(--border-subtle);

        .order-id-group {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .ref-label { font-size: 0.75rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; }
          .order-num { font-size: 1.15rem; color: #fff; }
          .order-date { font-size: 0.82rem; color: var(--text-dim); }
        }

        .order-status-group {
          display: flex;
          align-items: center;
          gap: 1.25rem;

          .total-val {
            font-family: var(--font-heading);
            font-size: 1.35rem;
            font-weight: 800;
            color: var(--accent-gold);
          }
        }
      }

      .order-timeline {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.75rem 2rem;
        margin: 1rem 0;
        background: rgba(0, 0, 0, 0.2);
        border-radius: var(--radius-sm);

        .timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;

          .step-icon {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid var(--border-subtle);
            color: var(--text-dim);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            transition: var(--transition);
          }

          span {
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-dim);
            text-transform: uppercase;
          }

          &.completed {
            .step-icon {
              background: var(--accent-emerald);
              border-color: var(--accent-emerald);
              color: #fff;
              box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
            }
            span { color: #fff; }
          }
        }

        .timeline-line {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.08);
          margin: 0 0.5rem;
          margin-bottom: 1.2rem;

          &.completed {
            background: var(--accent-emerald);
          }
        }
      }

      .order-items-table {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
        padding: 1rem 0;

        .order-item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.5rem 0;

          img {
            width: 54px;
            height: 54px;
            border-radius: var(--radius-sm);
            object-fit: cover;
          }

          .item-name-col {
            flex: 1;
            .name { font-weight: 600; color: #fff; font-size: 0.92rem; &:hover { color: var(--accent-primary); } }
            .qty { display: block; font-size: 0.8rem; color: var(--text-dim); }
          }

          .item-total {
            font-weight: 700;
            color: #fff;
            font-size: 1rem;
          }
        }
      }

      .order-card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1.25rem;
        border-top: 1px solid var(--border-subtle);

        .footer-meta {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          font-size: 0.84rem;
          color: var(--text-muted);
          strong { color: #fff; }
        }
      }
    }

    .empty-orders, .loading-state {
      padding: 5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      i { font-size: 4rem; color: var(--text-dim); }
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .order-card-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
      .order-card-footer { flex-direction: column; gap: 1rem; align-items: flex-start; }
      .order-timeline { padding: 1rem; }
    }
  `]
})
export class MyOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching orders', err);
        this.isLoading.set(false);
      }
    });
  }

  isStepCompleted(status: string, step: string): boolean {
    const sequence = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = sequence.indexOf(status);
    const stepIdx = sequence.indexOf(step);
    if (status === 'Cancelled') return false;
    return currentIdx >= stepIdx;
  }
}
