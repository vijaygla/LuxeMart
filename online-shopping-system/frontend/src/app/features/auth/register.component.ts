import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="logo-mark"><i class="ri-gem-line"></i></div>
          <h2>Create Your Account</h2>
          <p>Join LuxeMart to acquire bespoke collections and experience AI shopping.</p>
        </div>

        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              class="form-control"
              placeholder="e.g. Priya Sharma"
              [(ngModel)]="name"
              name="name"
              required
            />
          </div>

          <div class="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              class="form-control"
              placeholder="name@domain.com"
              [(ngModel)]="email"
              name="email"
              required
            />
          </div>

          <div class="form-group">
            <label>Password *</label>
            <input
              type="password"
              class="form-control"
              placeholder="Create strong password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </div>


          <button class="btn btn-primary btn-lg submit-btn" type="submit" [disabled]="isLoading">
            <span *ngIf="!isLoading">Create LuxeMart Account</span>
            <span *ngIf="isLoading">Registering...</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign In</a></p>
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
      max-width: 480px;
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
export class RegisterComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  role = 'Customer';
  isLoading = false;

  onSubmit(): void {
    if (!this.name || !this.email || !this.password) {
      this.toastService.error('Please fill all required fields.');
      return;
    }

    this.isLoading = true;
    this.authService.register({
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(`Welcome to LuxeMart, ${res.user.name}!`);
        this.router.navigate(['/catalog']);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.detail || 'Registration failed.');
      }
    });
  }
}
