import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  styles: [`
    .page { min-height:100vh; background:linear-gradient(180deg,#140923 0%,#0d0617 100%); color:#fff; }
    .hero { max-width:1200px; margin:0 auto; padding:40px 20px 60px; }
    .hero h1 { font-size:clamp(2.5rem,5vw,4rem); margin-bottom:10px; }
    .hero h1 span { color:#f6c035; }
    .layout { display:grid; grid-template-columns:1fr 1.1fr; gap:24px; margin-top:32px; }
    .card { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:24px; }
    form { display:grid; gap:12px; }
    input, textarea, select, button { padding:12px 14px; border-radius:14px; border:1px solid #5a3991; background:#160a29; color:#fff; }
    button { background:#8c52ff; cursor:pointer; font-weight:600; }
    .review-list { display:grid; gap:16px; }
    .review-item { padding:18px; border-radius:18px; background:#160a29; }
    .meta { color:#dbc9ff; font-size:13px; }
    @media (max-width:900px) { .layout { grid-template-columns:1fr; } }
  `],
  template: `
    <div class="page">
      <section class="hero">
        <a routerLink="/" style="color:#fff;text-decoration:none;">← Back Home</a>
        <h1>Anonymous <span>Reviews</span></h1>
        <p>Real experiences shared anonymously by MindEase users.</p>

        <div class="layout">
          <div class="card">
            <h2 style="margin-top:0;">Leave a review</h2>
            <p style="color:#d8cef1;">Your name will never be shown publicly.</p>
            <form (ngSubmit)="submitReview()">
              <select [(ngModel)]="review.rating" name="rating" required>
                <option [ngValue]="5">5 Stars</option>
                <option [ngValue]="4">4 Stars</option>
                <option [ngValue]="3">3 Stars</option>
                <option [ngValue]="2">2 Stars</option>
                <option [ngValue]="1">1 Star</option>
              </select>
              <input [(ngModel)]="review.title" name="title" placeholder="Review title" required>
              <textarea [(ngModel)]="review.message" name="message" rows="6" placeholder="Share your experience" required></textarea>
              <button type="submit">Submit anonymously</button>
            </form>
            <p *ngIf="message" style="margin-top:12px;color:#f6c035;">{{ message }}</p>
          </div>

          <div class="card">
            <h2 style="margin-top:0;">What people say about MindEase</h2>
            <div class="review-list">
              <article class="review-item" *ngFor="let item of reviews">
                <strong>{{ item.title }}</strong>
                <p class="meta">{{ item.rating }}/5 • Anonymous • {{ item.createdAt | date:'mediumDate' }}</p>
                <p>{{ item.message }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <app-footer></app-footer>
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly authService = inject(AuthService);
  reviews: any[] = [];
  message = '';
  review = { rating: 5, title: '', message: '' };

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.dataService.getReviews().subscribe(({ reviews }) => {
      this.reviews = reviews;
    });
  }

  submitReview(): void {
    if (!this.authService.currentUser()) {
      this.message = 'Please sign in before leaving a review.';
      return;
    }

    this.dataService.createReview(this.review).subscribe(() => {
      this.review = { rating: 5, title: '', message: '' };
      this.message = 'Thank you. Your anonymous review has been added.';
      this.loadReviews();
    });
  }
}
