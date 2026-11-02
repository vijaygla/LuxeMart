import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CatalogService } from '../../../core/services/catalog.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AiService } from '../../../core/services/ai.service';
import { Product, Review } from '../../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="product-detail-page container" *ngIf="product(); else loadingTpl">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb-nav">
        <a routerLink="/catalog"><i class="ri-arrow-left-line"></i> Back to Collections</a>
        <span class="sep">/</span>
        <span class="cat">{{ product()?.category_name }}</span>
        <span class="sep">/</span>
        <span class="current">{{ product()?.name }}</span>
      </nav>

      <!-- Main Product View: Gallery & Buy Box -->
      <div class="product-overview-grid">
        <!-- Gallery -->
        <div class="gallery-col">
          <div class="main-image-wrap glass-card">
            <img [src]="activeImage()" [alt]="product()?.name" />
            <span class="badge badge-gold" *ngIf="product()?.discount_price">
              Sale - Save {{ getDiscountPercent() }}%
            </span>
          </div>

          <!-- Thumbnail switcher -->
          <div class="thumbnails-row" *ngIf="galleryImages().length > 1">
            <button
              *ngFor="let img of galleryImages()"
              class="thumb-btn"
              [class.active]="activeImage() === img"
              (click)="activeImage.set(img)"
            >
              <img [src]="img" [alt]="product()?.name" />
            </button>
          </div>
        </div>

        <!-- Product Information & Actions -->
        <div class="info-col">
          <div class="header-info">
            <span class="category-pill">{{ product()?.category_name }}</span>
            <span class="sku-tag">SKU: {{ product()?.sku }}</span>
          </div>

          <h1 class="product-title">{{ product()?.name }}</h1>

          <!-- Ratings & Reviews summary -->
          <div class="rating-row">
            <div class="stars">
              <i class="ri-star-fill" *ngFor="let s of [1,2,3,4,5]"></i>
            </div>
            <span class="rating-num">{{ product()?.rating }} / 5.0</span>
            <span class="review-link">({{ product()?.reviews?.length || 0 }} Verified Client Reviews)</span>
          </div>

          <!-- Price & Discounts -->
          <div class="price-container">
            <span class="main-price">
              \${{ (product()?.discount_price || product()?.price) | number:'1.2-2' }}
            </span>
            <span class="original-price" *ngIf="product()?.discount_price">
              \${{ product()?.price | number:'1.2-2' }}
            </span>
            <span class="savings-text" *ngIf="product()?.discount_price">
              You save \${{ (product()!.price - product()!.discount_price!) | number:'1.2-2' }}
            </span>
          </div>

          <!-- Stock Indicator -->
          <div class="stock-status-bar">
            <span class="stock-badge" [class.low]="product()!.stock_quantity <= 10" *ngIf="product()!.stock_quantity > 0">
              <i class="ri-checkbox-circle-fill"></i> In Stock ({{ product()?.stock_quantity }} units available)
            </span>
            <span class="stock-badge out" *ngIf="product()!.stock_quantity <= 0">
              <i class="ri-close-circle-fill"></i> Currently Sold Out
            </span>
          </div>

          <!-- Description -->
          <p class="description-text">{{ product()?.description }}</p>

          <!-- Buy Box Controls -->
          <div class="buy-box glass-card" *ngIf="product()!.stock_quantity > 0">
            <div class="quantity-selector">
              <label>Quantity:</label>
              <div class="qty-control">
                <button (click)="decreaseQty()"><i class="ri-subtract-line"></i></button>
                <span>{{ quantity }}</span>
                <button (click)="increaseQty()"><i class="ri-add-line"></i></button>
              </div>
            </div>

            <div class="action-buttons">
              <button class="btn btn-primary btn-lg add-btn" (click)="addToCart()">
                <i class="ri-shopping-bag-3-line"></i> Add to Shopping Bag
              </button>
              <button class="btn btn-gold btn-lg buy-btn" (click)="buyNow()">
                Instant Checkout
              </button>
            </div>
          </div>

          <!-- AI Assistant Integration -->
          <div class="ai-consult-card glass-card" (click)="askAiAboutProduct()">
            <i class="ri-sparkling-fill"></i>
            <div>
              <strong>Have questions about this item?</strong>
              <p>Ask LuxeMart AI Concierge for sound specs, tailoring, or compatibility.</p>
            </div>
            <i class="ri-arrow-right-s-line arrow"></i>
          </div>

          <!-- Assurance Grid -->
          <div class="assurances-grid">
            <div class="assurance-item">
              <i class="ri-truck-line"></i>
              <span>Complimentary Shipping over $100</span>
            </div>
            <div class="assurance-item">
              <i class="ri-refresh-line"></i>
              <span>30-Day Bespoke Returns</span>
            </div>
            <div class="assurance-item">
              <i class="ri-shield-star-line"></i>
              <span>Direct Manufacturer Warranty</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Technical Specifications Section -->
      <section class="specs-section glass-card" *ngIf="getSpecsKeys().length > 0">
        <h2><i class="ri-file-list-2-line"></i> Technical Specifications</h2>
        <div class="specs-grid">
          <div class="spec-row" *ngFor="let key of getSpecsKeys()">
            <span class="spec-key">{{ key }}</span>
            <span class="spec-val">{{ parsedSpecs[key] }}</span>
          </div>
        </div>
      </section>

      <!-- Client Reviews Section -->
      <section class="reviews-section glass-card">
        <div class="reviews-header">
          <div>
            <h2>Verified Client Reviews</h2>
            <p>Reflecting authentic feedback from authenticated purchasers.</p>
          </div>
          <button class="btn btn-outline" *ngIf="!showReviewForm" (click)="openReviewForm()">
            <i class="ri-edit-line"></i> Write a Review
          </button>
        </div>

        <!-- Add Review Form -->
        <div class="review-form glass-card" *ngIf="showReviewForm">
          <h3>Leave Your Appraisal</h3>
          <div class="rating-picker">
            <label>Rating:</label>
            <div class="stars-select">
              <i
                *ngFor="let star of [1,2,3,4,5]"
                class="star-icon"
                [class.active]="star <= newRating"
                [class.ri-star-fill]="star <= newRating"
                [class.ri-star-line]="star > newRating"
                (click)="newRating = star"
              ></i>
            </div>
          </div>

          <div class="form-group">
            <label>Your Review Comments:</label>
            <textarea
              class="form-control"
              rows="4"
              placeholder="Share your experience regarding craftsmanship, performance, and aesthetics..."
              [(ngModel)]="newComment"
            ></textarea>
          </div>

          <div class="form-actions">
            <button class="btn btn-outline btn-sm" (click)="showReviewForm = false">Cancel</button>
            <button class="btn btn-primary btn-sm" (click)="submitReview()" [disabled]="!newComment.trim()">
              Submit Appraisal
            </button>
          </div>
        </div>

        <!-- Existing Reviews List -->
        <div class="reviews-list">
          <div class="review-card" *ngFor="let review of product()?.reviews">
            <div class="review-meta">
              <div class="reviewer">
                <div class="avatar">{{ review.user_name.charAt(0) }}</div>
                <div>
                  <strong>{{ review.user_name }}</strong>
                  <span class="verified-badge"><i class="ri-checkbox-circle-fill"></i> Verified Purchase</span>
                </div>
              </div>
              <div class="review-stars">
                <i class="ri-star-fill" *ngFor="let s of [1,2,3,4,5]"></i>
              </div>
            </div>
            <p class="review-text">"{{ review.comment }}"</p>
            <span class="review-date">{{ review.created_at | date:'mediumDate' }}</span>
          </div>

          <div class="no-reviews" *ngIf="!product()?.reviews || product()?.reviews?.length === 0">
            <p>No client reviews yet. Be the first to share your appraisal!</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading Fallback -->
    <ng-template #loadingTpl>
      <div class="detail-loading container">
        <div class="spinner"></div>
        <p>Retrieving product craftsmanship details...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .product-detail-page {
      padding-top: 2rem;
      padding-bottom: 5rem;
    }

    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-bottom: 2.5rem;

      a {
        color: var(--text-muted);
        display: flex;
        align-items: center;
        gap: 0.35rem;
        &:hover { color: var(--accent-gold); }
      }

      .sep { color: var(--border-subtle); }
      .current { color: #fff; font-weight: 600; }
    }

    .product-overview-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 3.5rem;
      margin-bottom: 4rem;
    }

    .gallery-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .main-image-wrap {
        position: relative;
        height: 520px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
        }
      }

      .thumbnails-row {
        display: flex;
        gap: 0.85rem;

        .thumb-btn {
          width: 75px;
          height: 75px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--bg-card);
          border: 2px solid transparent;
          cursor: pointer;
          transition: var(--transition);

          img { width: 100%; height: 100%; object-fit: cover; }

          &.active, &:hover {
            border-color: var(--accent-primary);
          }
        }
      }
    }

    .info-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .header-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .category-pill {
          color: var(--accent-gold);
          font-weight: 700;
          font-size: 0.82rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .sku-tag {
          font-size: 0.8rem;
          color: var(--text-dim);
          font-family: monospace;
        }
      }

      .product-title {
        font-size: 2.2rem;
        line-height: 1.2;
      }

      .rating-row {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.9rem;

        .stars { color: var(--accent-gold); }
        .rating-num { font-weight: 700; color: #fff; }
        .review-link { color: var(--text-muted); }
      }

      .price-container {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        margin: 0.5rem 0;

        .main-price {
          font-family: var(--font-heading);
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
        }

        .original-price {
          font-size: 1.2rem;
          color: var(--text-dim);
          text-decoration: line-through;
        }

        .savings-text {
          color: var(--accent-emerald);
          font-weight: 700;
          font-size: 0.95rem;
        }
      }

      .stock-status-bar {
        .stock-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--accent-emerald);

          &.low { color: var(--accent-gold); }
          &.out { color: var(--accent-rose); }
        }
      }

      .description-text {
        font-size: 1.05rem;
        color: var(--text-muted);
        line-height: 1.7;
      }

      .buy-box {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1.25rem;

        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 1.5rem;

          label { font-weight: 600; font-size: 0.95rem; color: var(--text-muted); }

          .qty-control {
            display: flex;
            align-items: center;
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-sm);

            button {
              background: none;
              color: #fff;
              width: 36px;
              height: 36px;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              &:hover { background: rgba(255, 255, 255, 0.1); }
            }

            span {
              width: 44px;
              text-align: center;
              font-weight: 700;
              font-size: 1rem;
            }
          }
        }

        .action-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
      }

      .ai-consult-card {
        padding: 1.1rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%);
        border: 1px solid rgba(99, 102, 241, 0.3);

        i { font-size: 1.8rem; color: #a5b4fc; }
        div {
          flex: 1;
          strong { font-size: 0.95rem; color: #fff; display: block; }
          p { font-size: 0.82rem; color: var(--text-muted); }
        }
        .arrow { font-size: 1.2rem; color: var(--text-dim); }

        &:hover {
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }
      }

      .assurances-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
        padding-top: 0.5rem;

        .assurance-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: var(--text-dim);
          font-size: 0.85rem;

          i { color: var(--accent-gold); font-size: 1.1rem; }
        }
      }
    }

    .specs-section, .reviews-section {
      padding: 2rem 2.5rem;
      margin-bottom: 2.5rem;

      h2 {
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.6rem;
        margin-bottom: 1.5rem;
      }
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.25rem;

      .spec-row {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-subtle);
        padding: 0.85rem 1.25rem;
        border-radius: var(--radius-sm);
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        .spec-key {
          font-size: 0.75rem;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .spec-val {
          font-size: 1rem;
          color: #fff;
          font-weight: 600;
        }
      }
    }

    .reviews-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;

      h2 { margin-bottom: 0.2rem; }
      p { color: var(--text-muted); font-size: 0.9rem; }
    }

    .review-form {
      padding: 1.5rem;
      margin-bottom: 2rem;
      border: 1px solid var(--border-accent);

      h3 { font-size: 1.15rem; margin-bottom: 1rem; }

      .rating-picker {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;

        label { font-size: 0.9rem; color: var(--text-muted); font-weight: 600; }

        .stars-select {
          display: flex;
          gap: 0.35rem;

          .star-icon {
            font-size: 1.4rem;
            color: var(--text-dim);
            cursor: pointer;
            transition: var(--transition);

            &.active { color: var(--accent-gold); }
            &:hover { transform: scale(1.2); }
          }
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
      }
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .review-card {
        padding: 1.25rem 1.5rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);

        .review-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .reviewer {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            .avatar {
              width: 34px;
              height: 34px;
              border-radius: 50%;
              background: var(--accent-primary);
              color: #fff;
              font-weight: 700;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            strong { color: #fff; display: block; font-size: 0.92rem; }
            .verified-badge {
              font-size: 0.72rem;
              color: var(--accent-emerald);
              display: flex;
              align-items: center;
              gap: 0.25rem;
            }
          }

          .review-stars { color: var(--accent-gold); font-size: 0.9rem; }
        }

        .review-text {
          font-style: italic;
          color: var(--text-main);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .review-date {
          display: block;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: var(--text-dim);
        }
      }

      .no-reviews {
        text-align: center;
        padding: 2rem;
        color: var(--text-dim);
      }
    }

    .detail-loading {
      padding: 6rem 0;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      color: var(--text-muted);
    }

    @media (max-width: 992px) {
      .product-overview-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private aiService = inject(AiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  activeImage = signal<string>('');
  galleryImages = signal<string[]>([]);
  parsedSpecs: Record<string, string> = {};

  quantity = 1;
  showReviewForm = false;
  newRating = 5;
  newComment = '';

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = +params['id'];
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  loadProduct(id: number): void {
    this.catalogService.getProductById(id).subscribe({
      next: (prod) => {
        this.product.set(prod);
        this.activeImage.set(prod.image_url);

        const images = [prod.image_url];
        if (prod.additional_images_json) {
          try {
            const addImages = JSON.parse(prod.additional_images_json);
            if (Array.isArray(addImages)) images.push(...addImages);
          } catch {}
        }
        this.galleryImages.set(images);

        if (prod.specs_json) {
          try {
            this.parsedSpecs = JSON.parse(prod.specs_json);
          } catch {
            this.parsedSpecs = {};
          }
        }
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.toastService.error('Product could not be located.');
        this.router.navigate(['/catalog']);
      }
    });
  }

  getSpecsKeys(): string[] {
    return Object.keys(this.parsedSpecs);
  }

  getDiscountPercent(): number {
    const p = this.product();
    if (!p || !p.discount_price) return 0;
    return Math.round(((p.price - p.discount_price) / p.price) * 100);
  }

  increaseQty(): void {
    const p = this.product();
    if (p && this.quantity < p.stock_quantity) {
      this.quantity++;
    }
  }

  decreaseQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;

    this.cartService.addToCart(p.id, this.quantity).subscribe({
      next: () => {
        this.toastService.success(`Added ${this.quantity} item(s) of "${p.name}" to cart.`);
      },
      error: () => {
        this.toastService.error('Please log in to add items to your cart.');
        this.router.navigate(['/login']);
      }
    });
  }

  buyNow(): void {
    const p = this.product();
    if (!p) return;

    this.cartService.addToCart(p.id, this.quantity).subscribe({
      next: () => {
        this.router.navigate(['/checkout']);
      },
      error: () => {
        this.toastService.error('Please log in to proceed.');
        this.router.navigate(['/login']);
      }
    });
  }

  askAiAboutProduct(): void {
    const p = this.product();
    if (!p) return;
    this.aiService.openChat();
    this.aiService.sendMessage(`Tell me more about ${p.name}. What are its standout specifications and benefits?`);
  }

  openReviewForm(): void {
    if (!this.authService.isAuthenticated()) {
      this.toastService.info('Please sign in to write an appraisal.');
      this.router.navigate(['/login']);
      return;
    }
    this.showReviewForm = true;
  }

  submitReview(): void {
    const p = this.product();
    if (!p || !this.newComment.trim()) return;

    this.catalogService.addReview(p.id, {
      rating: this.newRating,
      comment: this.newComment.trim()
    }).subscribe({
      next: () => {
        this.toastService.success('Thank you! Your appraisal has been published.');
        this.showReviewForm = false;
        this.newComment = '';
        this.loadProduct(p.id);
      },
      error: () => {
        this.toastService.error('Unable to submit review. Please try again.');
      }
    });
  }
}
