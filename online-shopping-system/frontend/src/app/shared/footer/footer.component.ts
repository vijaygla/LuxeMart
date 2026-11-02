import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer-wrapper">
      <div class="container footer-content">
        <div class="footer-col brand-col">
          <div class="brand-title">LUXE<span>MART</span></div>
          <p class="brand-desc">
            Redefining luxury online commerce with verified craftsmanship, bespoke concierge, and intelligent shopping.
          </p>
          <div class="social-links">
            <a href="#"><i class="ri-instagram-line"></i></a>
            <a href="#"><i class="ri-twitter-x-line"></i></a>
            <a href="#"><i class="ri-facebook-circle-line"></i></a>
            <a href="#"><i class="ri-linkedin-box-line"></i></a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Collections</h4>
          <ul>
            <li><a routerLink="/catalog" [queryParams]="{category_id: 1}">Electronics & Sound</a></li>
            <li><a routerLink="/catalog" [queryParams]="{category_id: 2}">Haute Couture & Apparel</a></li>
            <li><a routerLink="/catalog" [queryParams]="{category_id: 3}">Home Architecture</a></li>
            <li><a routerLink="/catalog" [queryParams]="{category_id: 4}">Wellness & Fitness</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><a routerLink="/orders">Track Consignment</a></li>
            <li><a href="#">Bespoke Returns Policy</a></li>
            <li><a href="#">Authenticity Guarantee</a></li>
            <li><a href="#">Contact Concierge</a></li>
          </ul>
        </div>

        <div class="footer-col security-col">
          <h4>Guaranteed Assurance</h4>
          <div class="assurance-cards">
            <div class="assurance-item">
              <i class="ri-shield-check-line"></i>
              <div>
                <strong>100% Certified</strong>
                <span>Direct manufacturer warranty</span>
              </div>
            </div>
            <div class="assurance-item">
              <i class="ri-lock-line"></i>
              <div>
                <strong>Secure Payments</strong>
                <span>256-Bit Encrypted Gateway</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-content">
          <p>&copy; 2026 LuxeMart International. Crafted with modern architecture and AI intelligence.</p>
          <div class="bottom-links">
            <a href="#">Privacy Protocol</a>
            <a href="#">Terms of Service</a>
            <a href="#">Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer-wrapper {
      background: #080c14;
      border-top: 1px solid var(--border-subtle);
      margin-top: 5rem;
      padding-top: 4rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 3rem;
      padding-bottom: 3rem;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      span { color: var(--accent-gold); }
    }
    .brand-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 1rem 0 1.5rem;
      line-height: 1.6;
    }
    .social-links {
      display: flex;
      gap: 0.75rem;
      a {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-subtle);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-muted);
        &:hover {
          background: var(--accent-primary);
          color: #fff;
          border-color: var(--accent-primary);
          transform: translateY(-2px);
        }
      }
    }
    .footer-col {
      h4 {
        font-size: 1rem;
        margin-bottom: 1.25rem;
        color: #fff;
      }
      ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        li a {
          color: var(--text-muted);
          font-size: 0.9rem;
          &:hover { color: var(--accent-gold); padding-left: 4px; }
        }
      }
    }
    .assurance-cards {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      .assurance-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.75rem 1rem;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-sm);
        i { font-size: 1.5rem; color: var(--accent-gold); }
        div {
          display: flex;
          flex-direction: column;
          strong { font-size: 0.85rem; color: #fff; }
          span { font-size: 0.75rem; color: var(--text-dim); }
        }
      }
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1.5rem 0;
      font-size: 0.82rem;
      color: var(--text-dim);
      .bottom-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .bottom-links {
        display: flex;
        gap: 1.5rem;
        a:hover { color: var(--text-muted); }
      }
    }
    @media (max-width: 900px) {
      .footer-content { grid-template-columns: 1fr; gap: 2rem; }
      .bottom-content { flex-direction: column; gap: 1rem; text-align: center; }
    }
  `]
})
export class FooterComponent {}
