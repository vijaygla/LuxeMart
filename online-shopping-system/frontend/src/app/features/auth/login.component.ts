import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card glass-card">
        <!-- Logo -->
        <div class="auth-header">
          <div class="logo-mark"><i class="ri-gem-line"></i></div>
          <h2>Welcome Back</h2>
          <p>Access your personalized luxury catalogue and order status.</p>
        </div>

        <!-- Login Form -->
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Work / Personal Email</label>
            <input
              type="email"
              class="form-control"
              placeholder="vijaykumar@gmail.com"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              class="form-control"
              placeholder="••••••••"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>

          <button class="btn btn-primary btn-lg submit-btn" type="submit" [disabled]="isLoading">
            <span *ngIf="!isLoading">Authorize & Sign In</span>
            <span *ngIf="isLoading">Authenticating...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>New to LuxeMart? <a routerLink="/register">Create an Account</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 1.5rem;
    }

    .auth-card {
      width: 100%;
      max-width: 460px;
      padding: 2.5rem;
      border: 1px solid var(--border-accent);
      box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;

      .logo-mark {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, #6366f1 0%, #f59e0b 100%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        color: #fff;
        margin-bottom: 1rem;
      }

      h2 { font-size: 1.75rem; margin-bottom: 0.35rem; }
      p { font-size: 0.9rem; color: var(--text-muted); }
    }

    .submit-btn {
      width: 100%;
      margin-top: 1rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.75rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.88rem;
      color: var(--text-muted);

      a {
        color: var(--accent-gold);
        font-weight: 600;
        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  email = '';
  password = '';
  isLoading = false;

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.toastService.error('Please provide your email and password.');
      return;
    }

    this.isLoading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role.toLowerCase() === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/catalog']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.detail || 'Invalid email or password.');
      }
    });
  }
}
