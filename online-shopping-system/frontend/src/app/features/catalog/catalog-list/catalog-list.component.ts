import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category, Product } from '../../../models/product.model';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="catalog-page">
      <!-- Luxury Hero Section -->
      <section class="hero-banner">
        <div class="container hero-container">
          <div class="hero-text">
            <span class="badge badge-gold"><i class="ri-sparkling-fill"></i> Spring 2026 Collection</span>
            <h1>Curated Precision. Timeless Craftsmanship.</h1>
            <p>
              Experience the pinnacle of acoustics, tailoring, interior design, and bespoke engineering, verified and backed by direct warranties.
            </p>
            <div class="hero-stats">
              <div>
                <strong>25+</strong>
                <span>Artisanal Brands</span>
              </div>
              <div class="divider"></div>
              <div>
                <strong>100%</strong>
                <span>Certified Genuine</span>
              </div>
              <div class="divider"></div>
              <div>
                <strong>24/7</strong>
                <span>AI Shopping Concierge</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Category Quick Filter Pills -->
      <div class="category-pills-bar">
        <div class="container pills-wrapper">
          <button
            class="pill-btn"
            [class.active]="selectedCategoryId === null"
            (click)="selectCategory(null)"
          >
            All Collections
          </button>
          <button
            *ngFor="let cat of categories()"
            class="pill-btn"
            [class.active]="selectedCategoryId === cat.id"
            (click)="selectCategory(cat.id)"
          >
            {{ cat.name }} ({{ cat.product_count }})
          </button>
        </div>
      </div>

      <!-- Main Layout: Sidebar & Products Grid -->
      <div class="container main-catalog-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar glass-card">
          <div class="sidebar-header">
            <h3><i class="ri-filter-3-line"></i> Filter Refinement</h3>
            <button class="clear-btn" (click)="resetFilters()">Reset All</button>
          </div>

          <!-- Search Filter -->
          <div class="filter-section">
            <label>Search Collection</label>
            <input
              type="text"
              class="form-control"
              placeholder="Search keyword..."
              [(ngModel)]="searchQuery"
              (ngModelChange)="onFilterChange()"
            />
          </div>

          <!-- Max Price Slider -->
          <div class="filter-section">
            <div class="range-header">
              <label>Max Price</label>
              <span class="range-val">\${{ maxPrice }}</span>
            </div>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              [(ngModel)]="maxPrice"
              (ngModelChange)="onFilterChange()"
            />
          </div>

          <!-- In Stock Only -->
          <div class="filter-section checkbox-filter">
            <label class="custom-checkbox">
              <input
                type="checkbox"
                [(ngModel)]="inStockOnly"
                (ngModelChange)="onFilterChange()"
              />
              <span class="checkmark"></span>
              In-Stock Items Only
            </label>
          </div>
        </aside>

        <!-- Products Grid Area -->
        <main class="products-container">
          <!-- Top Sort & Count Bar -->
          <div class="products-header glass-card">
            <p class="count-text">
              Showing <strong>{{ products().length }}</strong> of <strong>{{ totalProducts() }}</strong> luxury items
            </p>
            <div class="sort-wrapper">
              <label>Sort By:</label>
              <select [(ngModel)]="sortBy" (ngModelChange)="onFilterChange()">
                <option value="newest">Featured & Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Alphabetical</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div class="loading-state" *ngIf="isLoading()">
            <div class="spinner"></div>
            <p>Loading curated catalogue from database...</p>
          </div>

          <!-- Empty State -->
          <div class="empty-state glass-card" *ngIf="!isLoading() && products().length === 0">
            <i class="ri-search-eye-line"></i>
            <h3>No items matched your criteria</h3>
            <p>Try adjusting your search terms, price thresholds, or selected category.</p>
            <button class="btn btn-outline" (click)="resetFilters()">Clear Filters</button>
          </div>

          <!-- Products Grid -->
          <div class="products-grid" *ngIf="!isLoading() && products().length > 0">
            <div
              *ngFor="let product of products()"
              class="product-card glass-card interactive"
              (click)="viewProduct(product.id)"
            >
              <!-- Card Image & Badges -->
              <div class="card-image-wrap">
                <img [src]="product.image_url" [alt]="product.name" loading="lazy" />
                <div class="badges-overlay">
                  <span class="badge badge-gold" *ngIf="product.discount_price">
                    Save {{ getDiscountPercent(product.price, product.discount_price) }}%
                  </span>
                  <span class="badge badge-indigo" *ngIf="product.is_featured">
                    Iconic
                  </span>
                </div>
              </div>

              <!-- Card Body -->
              <div class="card-body">
                <div class="card-meta">
                  <span class="category-name">{{ product.category_name }}</span>
                  <div class="rating">
                    <i class="ri-star-fill"></i>
                    <span>{{ product.rating }}</span>
                    <small>({{ product.review_count }})</small>
                  </div>
                </div>

                <h3 class="product-title" [title]="product.name">{{ product.name }}</h3>
                <p class="product-desc">{{ product.description }}</p>

                <!-- Pricing & Cart Button -->
                <div class="card-footer">
                  <div class="price-box">
                    <span class="current-price">
                      \${{ (product.discount_price || product.price) | number:'1.2-2' }}
                    </span>
                    <span class="original-price" *ngIf="product.discount_price">
                      \${{ product.price | number:'1.2-2' }}
                    </span>
                  </div>

                  <button
                    class="add-cart-btn"
                    [disabled]="product.stock_quantity <= 0"
                    (click)="addToCart($event, product)"
                    [title]="product.stock_quantity > 0 ? 'Add to shopping bag' : 'Sold out'"
                  >
                    <i class="ri-shopping-bag-3-line"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div class="pagination-bar" *ngIf="totalPages() > 1">
            <button
              class="page-btn"
              [disabled]="currentPage === 1"
              (click)="changePage(currentPage - 1)"
            >
              <i class="ri-arrow-left-s-line"></i> Previous
            </button>
            <span class="page-indicator">Page {{ currentPage }} of {{ totalPages() }}</span>
            <button
              class="page-btn"
              [disabled]="currentPage === totalPages()"
              (click)="changePage(currentPage + 1)"
            >
              Next <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .catalog-page {
      min-height: 100vh;
      padding-bottom: 4rem;
    }

    .hero-banner {
      background: radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15), transparent 50%),
                  radial-gradient(circle at 10% 80%, rgba(245, 158, 11, 0.1), transparent 40%),
                  #0b0f19;
      border-bottom: 1px solid var(--border-subtle);
      padding: 4rem 0 3.5rem;

      .hero-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .hero-text {
        max-width: 750px;

        h1 {
          font-size: 2.75rem;
          line-height: 1.15;
          margin: 1.25rem 0 1rem;
          background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        p {
          color: var(--text-muted);
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
      }

      .hero-stats {
        display: flex;
        align-items: center;
        gap: 2rem;

        strong {
          display: block;
          font-size: 1.6rem;
          font-family: var(--font-heading);
          color: var(--accent-gold);
        }

        span {
          font-size: 0.8rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .divider {
          width: 1px;
          height: 35px;
          background: var(--border-subtle);
        }
      }
    }

    .category-pills-bar {
      background: rgba(11, 15, 25, 0.96);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      position: sticky;
      top: 0;
      z-index: 999;
      padding: 0.75rem 0;

      .pills-wrapper {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        overflow-x: auto;
      }

      .pill-btn {
        white-space: nowrap;
        background: rgba(255, 255, 255, 0.04);
        color: var(--text-muted);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-full);
        padding: 0.45rem 1.1rem;
        font-size: 0.84rem;
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        &.active {
          background: var(--accent-primary);
          color: #fff;
          border-color: var(--accent-primary);
          box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
        }
      }
    }

    .main-catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .filters-sidebar {
      padding: 1.5rem;
      height: fit-content;
      position: sticky;
      top: 70px;

      .sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        h3 {
          font-size: 1.05rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .clear-btn {
          background: none;
          color: var(--accent-gold);
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          &:hover { text-decoration: underline; }
        }
      }

      .filter-section {
        margin-bottom: 1.5rem;

        label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }

        .range-header {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .range-val {
            font-weight: 700;
            color: var(--accent-gold);
            font-size: 0.95rem;
          }
        }

        input[type="range"] {
          width: 100%;
          accent-color: var(--accent-primary);
          cursor: pointer;
        }

        &.checkbox-filter {
          .custom-checkbox {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            cursor: pointer;
            font-size: 0.88rem;
            color: var(--text-main);

            input { accent-color: var(--accent-primary); }
          }
        }
      }
    }

    .products-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .products-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.9rem 1.5rem;

      .count-text {
        font-size: 0.9rem;
        color: var(--text-muted);
        strong { color: #fff; }
      }

      .sort-wrapper {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.85rem;
        color: var(--text-muted);

        select {
          background: rgba(11, 15, 25, 0.8);
          color: #fff;
          border: 1px solid var(--border-subtle);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          &:focus { border-color: var(--accent-primary); }
        }
      }
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      cursor: pointer;

      .card-image-wrap {
        position: relative;
        height: 250px;
        background: #0d131f;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .badges-overlay {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
      }

      &:hover .card-image-wrap img {
        transform: scale(1.06);
      }

      .card-body {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        flex: 1;

        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;

          .category-name {
            font-size: 0.75rem;
            color: var(--accent-gold);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .rating {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.8rem;
            color: var(--accent-gold);

            span { font-weight: 700; color: #fff; }
            small { color: var(--text-dim); }
          }
        }

        .product-title {
          font-size: 1.05rem;
          margin-bottom: 0.4rem;
          line-height: 1.35;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.5;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--border-subtle);

          .price-box {
            display: flex;
            align-items: baseline;
            gap: 0.5rem;

            .current-price {
              font-family: var(--font-heading);
              font-size: 1.25rem;
              font-weight: 700;
              color: #fff;
            }

            .original-price {
              font-size: 0.85rem;
              color: var(--text-dim);
              text-decoration: line-through;
            }
          }

          .add-cart-btn {
            width: 38px;
            height: 38px;
            border-radius: var(--radius-sm);
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
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }

            &:disabled {
              background: rgba(255, 255, 255, 0.08);
              color: var(--text-dim);
              cursor: not-allowed;
            }
          }
        }
      }
    }

    .loading-state, .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      i { font-size: 3rem; color: var(--text-dim); }
      h3 { font-size: 1.3rem; }
      p { color: var(--text-muted); font-size: 0.95rem; }
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(99, 102, 241, 0.2);
      border-top-color: var(--accent-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      padding: 1.5rem 0;

      .page-btn {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.5rem 1rem;
        border-radius: var(--radius-sm);
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        color: var(--text-main);
        font-weight: 600;
        cursor: pointer;
        transition: var(--transition);

        &:hover:not(:disabled) {
          border-color: var(--accent-primary);
          color: #fff;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }

      .page-indicator {
        font-size: 0.9rem;
        color: var(--text-muted);
      }
    }

    @media (max-width: 992px) {
      .main-catalog-layout {
        grid-template-columns: 1fr;
      }
      .filters-sidebar {
        position: static;
      }
    }
  `]
})
export class CatalogListComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  totalProducts = signal<number>(0);
  totalPages = signal<number>(1);
  isLoading = signal<boolean>(true);

  selectedCategoryId: number | null = null;
  searchQuery = '';
  maxPrice = 3000;
  inStockOnly = false;
  sortBy = 'newest';
  currentPage = 1;

  ngOnInit(): void {
    this.loadCategories();

    this.route.queryParams.subscribe((params) => {
      if (params['category_id']) {
        this.selectedCategoryId = +params['category_id'];
      }
      if (params['search']) {
        this.searchQuery = params['search'];
      }
      this.loadProducts();
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.catalogService.getProducts({
      category_id: this.selectedCategoryId || undefined,
      search: this.searchQuery || undefined,
      max_price: this.maxPrice,
      in_stock_only: this.inStockOnly,
      sort_by: this.sortBy,
      page: this.currentPage,
      page_size: 12
    }).subscribe({
      next: (res) => {
        this.products.set(res.items);
        this.totalProducts.set(res.total);
        this.totalPages.set(res.pages);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading.set(false);
      }
    });
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.currentPage = 1;
    this.loadProducts();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadProducts();
  }

  resetFilters(): void {
    this.selectedCategoryId = null;
    this.searchQuery = '';
    this.maxPrice = 3000;
    this.inStockOnly = false;
    this.sortBy = 'newest';
    this.currentPage = 1;
    this.loadProducts();
  }

  changePage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
    window.scrollTo({ top: 400, behavior: 'smooth' });
  }

  viewProduct(id: number): void {
    this.router.navigate(['/product', id]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.toastService.success(`Added "${product.name}" to cart!`);
      },
      error: () => {
        this.toastService.error('Please log in to add items to your cart.');
        this.router.navigate(['/login']);
      }
    });
  }

  getDiscountPercent(price: number, discountPrice: number): number {
    return Math.round(((price - discountPrice) / price) * 100);
  }
}
