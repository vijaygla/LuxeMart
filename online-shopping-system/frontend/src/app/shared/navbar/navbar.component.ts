import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { AiService } from '../../core/services/ai.service';
import { CatalogService } from '../../core/services/catalog.service';
import { Category } from '../../models/product.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="navbar-wrapper">
      <!-- Top Announcement Bar -->
      <div class="top-announcement">
        <div class="container announcement-content">
          <span><i class="ri-truck-line"></i> Complimentary Express Delivery on orders over $100</span>
          <div class="top-links">
            <span *ngIf="authService.isAdmin()" class="admin-pill">
              <i class="ri-shield-star-line"></i> Admin Console Active
            </span>
            <button class="ai-quick-btn" (click)="aiService.openChat()">
              <i class="ri-sparkling-fill"></i> AI Personal Shopper
            </button>
          </div>
        </div>
      </div>

      <!-- Main Navbar -->
      <nav class="container main-nav">
        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo">
          <div class="logo-mark">
            <i class="ri-gem-line"></i>
          </div>
          <div class="logo-text">
            <span class="brand-name">LUXE<span>MART</span></span>
            <span class="brand-tagline">Curated Lifestyle</span>
          </div>
        </a>

        <!-- Search Bar -->
        <div class="search-box">
          <i class="ri-search-line search-icon"></i>
          <input
            type="text"
            placeholder="Search luxury tech, fashion, decor..."
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
          />
          <button class="search-btn" (click)="onSearch()">
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>

        <!-- Navigation Actions -->
        <div class="nav-actions">
          <!-- Catalog Link -->
          <a routerLink="/catalog" routerLinkActive="active" class="nav-item">
            <i class="ri-store-2-line"></i>
            <span>Shop</span>
          </a>

          <!-- Admin Dashboard Link (if Admin) -->
          <a *ngIf="authService.isAdmin()" routerLink="/admin" routerLinkActive="active" class="nav-item admin-link">
            <i class="ri-dashboard-3-line"></i>
            <span>Admin</span>
          </a>

          <!-- Shopping Cart Badge -->
          <a routerLink="/cart" class="nav-item cart-btn" title="Shopping Cart">
            <i class="ri-shopping-bag-3-line"></i>
            <span class="badge-count" *ngIf="cartService.itemCount() > 0">
              {{ cartService.itemCount() }}
            </span>
          </a>

          <!-- User Account Menu -->
          <div class="user-menu-wrapper" *ngIf="authService.isAuthenticated(); else guestBlock">
            <button class="user-avatar-btn" (click)="toggleUserDropdown()">
              <div class="avatar-circle">
                {{ getUserInitial() }}
              </div>
              <span class="user-name-text">{{ authService.currentUser()?.name }}</span>
              <i class="ri-arrow-down-s-line"></i>
            </button>

            <!-- Dropdown -->
            <div class="user-dropdown" *ngIf="dropdownOpen()">
              <div class="dropdown-header">
                <p class="name">{{ authService.currentUser()?.name }}</p>
                <p class="email">{{ authService.currentUser()?.email }}</p>
                <span class="role-badge">{{ authService.currentUser()?.role }}</span>
              </div>
              <div class="dropdown-divider"></div>
              <a routerLink="/orders" (click)="dropdownOpen.set(false)" class="dropdown-item">
                <i class="ri-file-list-3-line"></i> My Orders
              </a>
              <a *ngIf="authService.isAdmin()" routerLink="/admin" (click)="dropdownOpen.set(false)" class="dropdown-item">
                <i class="ri-settings-4-line"></i> Admin Dashboard
              </a>
              <div class="dropdown-divider"></div>
              <button (click)="logout()" class="dropdown-item logout-item">
                <i class="ri-logout-box-r-line"></i> Sign Out
              </button>
            </div>
          </div>

          <ng-template #guestBlock>
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-outline btn-sm">Sign In</a>
              <a routerLink="/register" class="btn btn-primary btn-sm">Join</a>
            </div>
          </ng-template>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    .navbar-wrapper {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--bg-glass);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .top-announcement {
      background: linear-gradient(90deg, #111827 0%, #1e1b4b 50%, #111827 100%);
      font-size: 0.78rem;
      padding: 0.4rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      color: var(--text-muted);

      .announcement-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .top-links {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .admin-pill {
        background: rgba(245, 158, 11, 0.2);
        color: var(--accent-gold);
        padding: 0.15rem 0.5rem;
        border-radius: var(--radius-full);
        font-weight: 600;
      }
      .ai-quick-btn {
        background: none;
        color: #a5b4fc;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-weight: 600;
        &:hover { color: #fff; text-shadow: 0 0 10px rgba(165, 180, 252, 0.8); }
      }
    }

    .main-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      padding-top: 0.9rem;
      padding-bottom: 0.9rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.85rem;

      .logo-mark {
        width: 42px;
        height: 42px;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, #6366f1 0%, #f59e0b 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
        color: #fff;
        box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
      }

      .logo-text {
        display: flex;
        flex-direction: column;
        line-height: 1.1;

        .brand-name {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #fff;
          span { color: var(--accent-gold); }
        }
        .brand-tagline {
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-dim);
        }
      }
    }

    .search-box {
      flex: 1;
      max-width: 480px;
      display: flex;
      align-items: center;
      background: rgba(11, 15, 25, 0.7);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-full);
      padding: 0.35rem 0.6rem 0.35rem 1rem;
      transition: var(--transition);

      &:focus-within {
        border-color: var(--accent-primary);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
        background: rgba(11, 15, 25, 0.95);
      }

      .search-icon {
        color: var(--text-dim);
        font-size: 1.1rem;
        margin-right: 0.5rem;
      }

      input {
        flex: 1;
        background: none;
        color: var(--text-main);
        font-size: 0.9rem;
        &::placeholder { color: var(--text-dim); }
      }

      .search-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: var(--accent-primary);
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: var(--transition);
        &:hover { background: var(--accent-primary-hover); transform: scale(1.05); }
      }
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        color: var(--text-muted);
        font-weight: 600;
        font-size: 0.92rem;
        position: relative;
        padding: 0.4rem 0.6rem;
        border-radius: var(--radius-sm);

        &:hover, &.active {
          color: #fff;
        }

        &.admin-link {
          color: var(--accent-gold);
          background: rgba(245, 158, 11, 0.1);
        }

        &.cart-btn {
          font-size: 1.3rem;
          position: relative;
          color: var(--text-main);

          .badge-count {
            position: absolute;
            top: -2px;
            right: -6px;
            background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
            color: #fff;
            font-size: 0.7rem;
            font-weight: 700;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(244, 63, 94, 0.5);
          }
        }
      }
    }

    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }

    .user-menu-wrapper {
      position: relative;

      .user-avatar-btn {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        padding: 0.35rem 0.75rem 0.35rem 0.4rem;
        border-radius: var(--radius-full);
        color: var(--text-main);
        cursor: pointer;
        transition: var(--transition);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .avatar-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: #fff;
          font-weight: 700;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name-text {
          font-weight: 600;
          font-size: 0.88rem;
          max-width: 110px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .user-dropdown {
        position: absolute;
        top: calc(100% + 0.6rem);
        right: 0;
        width: 220px;
        background: var(--bg-surface);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
        animation: fadeIn 0.2s ease-out;

        .dropdown-header {
          padding: 0.6rem 0.75rem;
          .name { font-weight: 700; color: #fff; font-size: 0.92rem; }
          .email { font-size: 0.75rem; color: var(--text-muted); }
          .role-badge {
            display: inline-block;
            margin-top: 0.3rem;
            font-size: 0.68rem;
            text-transform: uppercase;
            font-weight: 700;
            color: var(--accent-gold);
          }
        }

        .dropdown-divider {
          height: 1px;
          background: var(--border-subtle);
          margin: 0.3rem 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          font-size: 0.88rem;
          font-weight: 500;
          background: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: var(--transition);

          &:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
          }

          &.logout-item {
            color: var(--accent-rose);
            &:hover { background: rgba(244, 63, 94, 0.1); }
          }
        }
      }
    }

    @media (max-width: 900px) {
      .search-box { display: none; }
      .brand-tagline { display: none; }
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  aiService = inject(AiService);
  catalogService = inject(CatalogService);
  router = inject(Router);

  searchQuery = '';
  dropdownOpen = signal<boolean>(false);

  toggleUserDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  getUserInitial(): string {
    const name = this.authService.currentUser()?.name;
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { search: this.searchQuery.trim() } });
    }
  }

  logout(): void {
    this.dropdownOpen.set(false);
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
