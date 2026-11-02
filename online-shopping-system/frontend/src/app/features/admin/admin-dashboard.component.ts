import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { CatalogService } from '../../core/services/catalog.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { DashboardStats } from '../../models/admin.model';
import { Product, Category } from '../../models/product.model';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page container">
      <!-- Dashboard Top Header -->
      <div class="admin-header">
        <div>
          <span class="badge badge-gold"><i class="ri-shield-star-fill"></i> Enterprise Control Panel</span>
          <h1>Store Administration & Intelligence</h1>
          <p>Real-time telemetry, database inventory control, and order lifecycle management.</p>
        </div>

        <div class="header-actions">
          <button class="btn btn-primary btn-sm" (click)="openProductModal()">
            <i class="ri-add-circle-line"></i> New Product
          </button>
          <button class="btn btn-outline btn-sm" (click)="loadAllData()">
            <i class="ri-refresh-line"></i> Sync Data
          </button>
        </div>
      </div>

      <!-- KPI Stat Cards -->
      <div class="kpi-grid" *ngIf="stats()">
        <div class="kpi-card glass-card">
          <div class="kpi-icon gold"><i class="ri-money-dollar-circle-line"></i></div>
          <div class="kpi-info">
            <span class="label">Gross Sales Revenue</span>
            <span class="value">\${{ stats()!.total_revenue | number:'1.2-2' }}</span>
            <small class="trend positive"><i class="ri-arrow-up-line"></i> Live DB Settlements</small>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon indigo"><i class="ri-shopping-cart-2-line"></i></div>
          <div class="kpi-info">
            <span class="label">Total Orders Placed</span>
            <span class="value">{{ stats()!.total_orders }}</span>
            <small class="trend"><i class="ri-time-line"></i> {{ stats()!.pending_orders }} In Progress</small>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon cyan"><i class="ri-box-3-line"></i></div>
          <div class="kpi-info">
            <span class="label">Active Catalog Products</span>
            <span class="value">{{ stats()!.total_products }}</span>
            <small class="trend"><i class="ri-stack-line"></i> Across 6 Categories</small>
          </div>
        </div>

        <div class="kpi-card glass-card">
          <div class="kpi-icon rose" [class.alert]="stats()!.low_stock_count > 0">
            <i class="ri-alert-line"></i>
          </div>
          <div class="kpi-info">
            <span class="label">Low Stock Inventory</span>
            <span class="value">{{ stats()!.low_stock_count }}</span>
            <small class="trend danger"><i class="ri-error-warning-line"></i> Less than 10 units</small>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="admin-tabs-bar">
        <button class="tab-btn" [class.active]="activeTab === 'products'" (click)="activeTab = 'products'">
          <i class="ri-store-2-line"></i> Inventory & Products ({{ products().length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
          <i class="ri-file-list-3-line"></i> Consignments & Orders ({{ orders().length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'categories'" (click)="activeTab = 'categories'">
          <i class="ri-price-tag-3-line"></i> Category Taxonomies ({{ categories().length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'analytics'" (click)="activeTab = 'analytics'">
          <i class="ri-pie-chart-line"></i> Category Revenue
        </button>
      </div>

      <!-- ================= TAB 1: PRODUCTS ================= -->
      <div class="tab-content" *ngIf="activeTab === 'products'">
        <div class="content-toolbar glass-card">
          <div class="search-input-wrap">
            <i class="ri-search-line"></i>
            <input
              type="text"
              placeholder="Search by SKU, product name..."
              [(ngModel)]="prodSearch"
              (ngModelChange)="filterProducts()"
            />
          </div>

          <div class="toolbar-actions">
            <button class="btn btn-primary btn-sm" (click)="openProductModal()">
              <i class="ri-add-line"></i> Add Product
            </button>
          </div>
        </div>

        <!-- Products Table -->
        <div class="table-card glass-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Retail Price</th>
                <th>Stock Units</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of filteredProducts()">
                <td class="product-cell">
                  <img [src]="p.image_url" [alt]="p.name" />
                  <div>
                    <strong>{{ p.name }}</strong>
                    <span class="rating-tiny">★ {{ p.rating }} ({{ p.review_count }} reviews)</span>
                  </div>
                </td>
                <td class="sku-cell">{{ p.sku }}</td>
                <td>{{ p.category_name }}</td>
                <td class="price-cell">
                  <strong *ngIf="p.discount_price">\${{ p.discount_price | number:'1.2-2' }}</strong>
                  <span [class.strikethrough]="p.discount_price">\${{ p.price | number:'1.2-2' }}</span>
                </td>
                <td>
                  <span class="stock-pill" [class.low]="p.stock_quantity <= 10">
                    {{ p.stock_quantity }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-emerald" *ngIf="p.is_active">Active</span>
                  <span class="badge badge-rose" *ngIf="!p.is_active">Archived</span>
                </td>
                <td class="actions-cell">
                  <button class="action-btn edit" (click)="openProductModal(p)" title="Edit product">
                    <i class="ri-pencil-line"></i>
                  </button>
                  <button class="action-btn delete" (click)="deleteProduct(p.id)" title="Archive product">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= TAB 2: ORDERS ================= -->
      <div class="tab-content" *ngIf="activeTab === 'orders'">
        <div class="table-card glass-card">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order Ref</th>
                <th>Client Name</th>
                <th>Destination</th>
                <th>Total Paid</th>
                <th>Payment Status</th>
                <th>Fulfillment Status</th>
                <th>Modify Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders()">
                <td><strong>#{{ o.order_number }}</strong></td>
                <td>{{ o.shipping_name }}</td>
                <td>{{ o.shipping_city }}, {{ o.shipping_postal_code }}</td>
                <td class="price-cell">\${{ o.total_amount | number:'1.2-2' }}</td>
                <td>
                  <span class="badge badge-emerald" *ngIf="o.payment_status === 'Paid'">{{ o.payment_status }}</span>
                  <span class="badge badge-gold" *ngIf="o.payment_status !== 'Paid'">{{ o.payment_status }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="{
                      'badge-emerald': o.status === 'Delivered',
                      'badge-indigo': o.status === 'Shipped',
                      'badge-gold': o.status === 'Processing' || o.status === 'Pending',
                      'badge-rose': o.status === 'Cancelled'
                    }"
                  >
                    {{ o.status }}
                  </span>
                </td>
                <td>
                  <select
                    class="status-select"
                    [ngModel]="o.status"
                    (ngModelChange)="updateOrderStatus(o.id, $event)"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= TAB 3: CATEGORIES ================= -->
      <div class="tab-content" *ngIf="activeTab === 'categories'">
        <div class="categories-admin-grid">
          <div class="category-admin-card glass-card" *ngFor="let c of categories()">
            <img [src]="c.image_url" [alt]="c.name" class="cat-cover" />
            <div class="cat-details">
              <h3>{{ c.name }}</h3>
              <p class="cat-slug">slug: <code>{{ c.slug }}</code></p>
              <p class="cat-desc">{{ c.description }}</p>
              <div class="cat-meta">
                <span class="badge badge-indigo">{{ c.product_count }} Products</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 4: ANALYTICS ================= -->
      <div class="tab-content" *ngIf="activeTab === 'analytics'">
        <div class="analytics-card glass-card">
          <h2>Revenue Distribution by Taxonomy</h2>
          <div class="category-bars-list" *ngIf="stats()?.category_sales">
            <div class="category-bar-item" *ngFor="let cs of stats()?.category_sales">
              <div class="bar-label-row">
                <strong>{{ cs.category_name }}</strong>
                <span>\${{ cs.total_sales | number:'1.2-2' }} ({{ cs.product_count }} catalog items)</span>
              </div>
              <div class="progress-bar-bg">
                <div class="progress-bar-fill" [style.width.%]="getSalesPercent(cs.total_sales)"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CREATE / EDIT PRODUCT MODAL -->
    <div class="modal-backdrop" *ngIf="showModal">
      <div class="modal-content glass-card fade-in">
        <div class="modal-header">
          <h2>{{ editingProductId ? 'Edit Product' : 'Add New Luxury Item' }}</h2>
          <button class="close-btn" (click)="showModal = false"><i class="ri-close-line"></i></button>
        </div>

        <form (ngSubmit)="saveProduct()" class="modal-body">
          <div class="form-row">
            <div class="form-group col-8">
              <label>Product Title *</label>
              <input type="text" class="form-control" [(ngModel)]="prodForm.name" name="name" required />
            </div>
            <div class="form-group col-4">
              <label>SKU Code *</label>
              <input type="text" class="form-control" [(ngModel)]="prodForm.sku" name="sku" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-6">
              <label>Category *</label>
              <select class="form-control" [(ngModel)]="prodForm.category_id" name="category_id" required>
                <option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div class="form-group col-3">
              <label>Retail Price ($) *</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="prodForm.price" name="price" required />
            </div>
            <div class="form-group col-3">
              <label>Discount Price ($)</label>
              <input type="number" step="0.01" class="form-control" [(ngModel)]="prodForm.discount_price" name="discount_price" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group col-4">
              <label>Inventory Stock *</label>
              <input type="number" class="form-control" [(ngModel)]="prodForm.stock_quantity" name="stock_quantity" required />
            </div>
            <div class="form-group col-8">
              <label>Primary Image CDN URL *</label>
              <input type="text" class="form-control" [(ngModel)]="prodForm.image_url" (ngModelChange)="cleanImageUrl()" name="image_url" placeholder="https://images.unsplash.com/..." required />
            </div>
          </div>

          <!-- Image Preview -->
          <div class="image-preview-wrap" *ngIf="prodForm.image_url">
            <span>Preview:</span>
            <img [src]="prodForm.image_url" alt="Preview" (error)="onImgError($event)" />
          </div>

          <div class="form-group">
            <label>Comprehensive Description *</label>
            <textarea class="form-control" rows="3" [(ngModel)]="prodForm.description" name="description" required></textarea>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="showModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ editingProductId ? 'Update Product' : 'Save & Publish Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding-top: 2.5rem;
      padding-bottom: 5rem;
      min-height: 85vh;
    }

    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;

      h1 { font-size: 2.2rem; margin: 0.5rem 0 0.35rem; }
      p { color: var(--text-muted); font-size: 1rem; }

      .header-actions {
        display: flex;
        gap: 0.75rem;
      }
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2.5rem;

      .kpi-card {
        padding: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.25rem;

        .kpi-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;

          &.gold { background: rgba(245, 158, 11, 0.15); color: var(--accent-gold); }
          &.indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
          &.cyan { background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); }
          &.rose { background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); }
          &.alert { animation: pulse 2s infinite; }
        }

        .kpi-info {
          display: flex;
          flex-direction: column;

          .label { font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700; }
          .value { font-family: var(--font-heading); font-size: 1.7rem; font-weight: 800; color: #fff; line-height: 1.2; margin: 0.2rem 0; }
          .trend {
            font-size: 0.75rem;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 0.25rem;

            &.positive { color: var(--accent-emerald); }
            &.danger { color: var(--accent-rose); }
          }
        }
      }
    }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(244, 63, 94, 0); }
    }

    .admin-tabs-bar {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 2rem;

      .tab-btn {
        background: none;
        color: var(--text-muted);
        padding: 0.75rem 1.25rem;
        font-weight: 600;
        font-size: 0.95rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-bottom: 2px solid transparent;
        transition: var(--transition);

        &:hover { color: #fff; }

        &.active {
          color: var(--accent-gold);
          border-bottom-color: var(--accent-gold);
        }
      }
    }

    .content-toolbar {
      padding: 1rem 1.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      .search-input-wrap {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        background: rgba(11, 15, 25, 0.7);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0.45rem 0.85rem;
        width: 320px;

        input { background: none; color: #fff; width: 100%; }
        i { color: var(--text-dim); }
      }
    }

    .table-card {
      overflow-x: auto;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;

      th {
        text-align: left;
        padding: 1rem 1.25rem;
        color: var(--text-dim);
        font-size: 0.78rem;
        text-transform: uppercase;
        font-weight: 700;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--border-subtle);
      }

      td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-muted);
      }

      tbody tr:hover {
        background: rgba(255, 255, 255, 0.02);
      }

      .product-cell {
        display: flex;
        align-items: center;
        gap: 1rem;

        img {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        strong { color: #fff; font-size: 0.95rem; display: block; }
        .rating-tiny { font-size: 0.75rem; color: var(--accent-gold); }
      }

      .sku-cell { font-family: monospace; font-size: 0.82rem; }

      .price-cell {
        strong { color: #fff; font-weight: 700; margin-right: 0.4rem; }
        .strikethrough { text-decoration: line-through; color: var(--text-dim); font-size: 0.8rem; }
      }

      .stock-pill {
        display: inline-block;
        padding: 0.2rem 0.6rem;
        border-radius: var(--radius-full);
        background: rgba(16, 185, 129, 0.15);
        color: var(--accent-emerald);
        font-weight: 700;
        font-size: 0.82rem;

        &.low {
          background: rgba(244, 63, 94, 0.15);
          color: var(--accent-rose);
        }
      }

      .status-select {
        background: rgba(11, 15, 25, 0.8);
        color: #fff;
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        padding: 0.35rem 0.6rem;
        font-size: 0.82rem;
        cursor: pointer;
        &:focus { border-color: var(--accent-primary); }
      }

      .actions-cell {
        display: flex;
        gap: 0.5rem;

        .action-btn {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);

          &.edit:hover { background: var(--accent-primary); color: #fff; }
          &.delete:hover { background: var(--accent-rose); color: #fff; }
        }
      }
    }

    .categories-admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;

      .category-admin-card {
        overflow: hidden;

        .cat-cover {
          width: 100%;
          height: 140px;
          object-fit: cover;
        }

        .cat-details {
          padding: 1.25rem;

          h3 { font-size: 1.15rem; margin-bottom: 0.35rem; }
          .cat-slug { font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0.5rem; }
          .cat-desc { font-size: 0.85rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1rem; }
        }
      }
    }

    .analytics-card {
      padding: 2rem;

      h2 { font-size: 1.35rem; margin-bottom: 1.5rem; }

      .category-bars-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        .category-bar-item {
          .bar-label-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.9rem;
            margin-bottom: 0.4rem;
            strong { color: #fff; }
            span { color: var(--text-dim); }
          }

          .progress-bar-bg {
            height: 8px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-full);
            overflow: hidden;

            .progress-bar-fill {
              height: 100%;
              background: linear-gradient(90deg, #6366f1 0%, #f59e0b 100%);
              border-radius: var(--radius-full);
              transition: width 0.5s ease;
            }
          }
        }
      }
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;

      .modal-content {
        width: 100%;
        max-width: 680px;
        background: var(--bg-surface);
        border: 1px solid var(--border-accent);
        border-radius: var(--radius-lg);
        padding: 2rem;
        max-height: 90vh;
        overflow-y: auto;

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;

          h2 { font-size: 1.4rem; }
          .close-btn {
            background: none;
            color: var(--text-dim);
            font-size: 1.5rem;
            cursor: pointer;
            &:hover { color: #fff; }
          }
        }

        .image-preview-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
          font-size: 0.85rem;
          color: var(--text-dim);

          img {
            width: 70px;
            height: 70px;
            border-radius: var(--radius-sm);
            object-fit: cover;
            border: 1px solid var(--border-subtle);
          }
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--border-subtle);
        }
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;

      .col-8 { flex: 2; }
      .col-6 { flex: 1.5; }
      .col-4 { flex: 1; }
      .col-3 { flex: 0.8; }
    }

    @media (max-width: 900px) {
      .kpi-grid { grid-template-columns: repeat(2, 1fr); }
      .admin-header { flex-direction: column; gap: 1rem; }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private adminService = inject(AdminService);
  private catalogService = inject(CatalogService);
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);

  stats = signal<DashboardStats | null>(null);
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  orders = signal<Order[]>([]);

  activeTab: 'products' | 'orders' | 'categories' | 'analytics' = 'products';
  prodSearch = '';

  // Modal State
  showModal = false;
  editingProductId: number | null = null;
  prodForm: any = {
    name: '',
    slug: '',
    sku: '',
    category_id: 1,
    price: 0,
    discount_price: null,
    stock_quantity: 10,
    image_url: '',
    description: '',
    specs_json: '{}'
  };

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.adminService.getStats().subscribe({
      next: (s) => this.stats.set(s),
      error: (err) => console.error('Error loading stats', err)
    });

    this.catalogService.getProducts({ page: 1, page_size: 100 }).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.filteredProducts.set(res.items);
      }
    });

    this.catalogService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats)
    });

    this.orderService.getAllOrders().subscribe({
      next: (ords) => this.orders.set(ords)
    });
  }

  filterProducts(): void {
    const q = this.prodSearch.toLowerCase().trim();
    if (!q) {
      this.filteredProducts.set(this.products());
    } else {
      this.filteredProducts.set(
        this.products().filter(
          (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
        )
      );
    }
  }

  getSalesPercent(amount: number): number {
    const total = this.stats()?.total_revenue || 1;
    return Math.min(100, Math.round((amount / total) * 100));
  }

  updateOrderStatus(orderId: number, status: string): void {
    this.orderService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.toastService.success(`Order status updated to ${status}`);
        this.loadAllData();
      },
      error: () => {
        this.toastService.error('Failed to update order status');
      }
    });
  }

  openProductModal(prod?: Product): void {
    if (prod) {
      this.editingProductId = prod.id;
      this.prodForm = {
        name: prod.name,
        slug: prod.slug,
        sku: prod.sku,
        category_id: prod.category_id,
        price: prod.price,
        discount_price: prod.discount_price,
        stock_quantity: prod.stock_quantity,
        image_url: prod.image_url,
        description: prod.description,
        specs_json: prod.specs_json || '{}'
      };
    } else {
      this.editingProductId = null;
      this.prodForm = {
        name: '',
        slug: '',
        sku: 'LUXE-' + Math.floor(1000 + Math.random() * 9000),
        category_id: this.categories()[0]?.id || 1,
        price: 99,
        discount_price: null,
        stock_quantity: 25,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
        description: '',
        specs_json: '{}'
      };
    }
    this.showModal = true;
  }

  cleanImageUrl(): void {
    const url = this.prodForm.image_url?.trim() || '';
    if (url.includes('google.com/imgres') || url.includes('&imgurl=') || url.includes('?imgurl=')) {
      try {
        const parsed = new URL(url);
        const realImg = parsed.searchParams.get('imgurl');
        if (realImg) {
          this.prodForm.image_url = decodeURIComponent(realImg);
        }
      } catch {
        // keep url as is
      }
    }
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
    }
  }

  saveProduct(): void {
    this.cleanImageUrl();
    if (!this.prodForm.name.trim() || !this.prodForm.image_url.trim()) {
      this.toastService.error('Please enter a product name and image URL.');
      return;
    }

    if (!this.prodForm.slug) {
      this.prodForm.slug = this.prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    }

    if (this.editingProductId) {
      this.catalogService.updateProduct(this.editingProductId, this.prodForm).subscribe({
        next: () => {
          this.toastService.success('Product updated successfully!');
          this.showModal = false;
          this.loadAllData();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to update product.');
        }
      });
    } else {
      this.catalogService.createProduct(this.prodForm).subscribe({
        next: () => {
          this.toastService.success('Product created and published!');
          this.showModal = false;
          this.loadAllData();
        },
        error: (err) => {
          this.toastService.error(err.error?.detail || 'Failed to create product.');
        }
      });
    }
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you wish to archive this product?')) {
      this.catalogService.deleteProduct(id).subscribe({
        next: () => {
          this.toastService.info('Product archived.');
          this.loadAllData();
        },
        error: () => {
          this.toastService.error('Could not archive product.');
        }
      });
    }
  }
}
