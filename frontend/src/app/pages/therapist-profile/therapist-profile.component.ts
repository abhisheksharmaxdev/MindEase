import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { findDefaultTherapist } from '../../core/data/default-therapists';
import { AuthService } from '../../core/services/auth.service';
import { BookingService } from '../../core/services/booking.service';
import { DataService } from '../../core/services/data.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-therapist-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/therapist-profile.css'],
  template: `
    <header class="top-header">
      <div class="logo-container">
        <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo" class="logo">
      </div>
      <h1 class="page-title">{{ therapist?.fullName || 'Therapist' }}'s profile</h1>
      <nav class="nav-container">
        <a routerLink="/" class="nav-link">Home</a>
        <a routerLink="/dashboard" class="user-avatar">{{ (currentUser()?.fullName?.slice(0, 2) || 'ME').toUpperCase() }}</a>
      </nav>
    </header>

    <main class="profile-container" *ngIf="therapist; else profileUnavailable">
      <aside class="profile-sidebar">
        <div class="profile-card">
          <div class="avatar-container">
            <img [src]="therapist.therapistProfile?.avatarUrl || therapist.avatarUrl || fallbackAvatar" [alt]="therapist.fullName">
          </div>
          <h2>{{ therapist.fullName }}</h2>
          <p class="pronouns">{{ therapist.therapistProfile?.pronouns || therapist.therapistProfile?.gender }}</p>
          <div class="badge">{{ therapist.therapistProfile?.qualification }}</div>
          <div class="info-list">
            <div class="info-item"><span class="icon">★</span><span>{{ therapist.therapistProfile?.experienceText || 'New therapist' }}</span></div>
            <div class="info-item"><span class="icon">A</span><span>{{ (therapist.therapistProfile?.languages || []).join(', ') || 'English' }}</span></div>
          </div>
        </div>
      </aside>

      <section class="profile-details">
        <div class="details-card">
          <div class="about-section">
            <h3>About Me</h3>
            <p>{{ therapist.therapistProfile?.bio || 'This therapist profile is ready for appointments and support conversations.' }}</p>
            <div class="qualification-badge">Graduation {{ therapist.therapistProfile?.qualification }}</div>
          </div>

          <div class="pricing-section">
            <h3>Plans & Pricing</h3>
            <p class="subtitle">Online or Offline sessions with {{ therapist.fullName }}</p>
            <div class="pricing-grid">
              <div class="price-card" *ngFor="let plan of plans" [class.active]="selectedPlan === plan" (click)="selectedPlan = plan">
                <div class="card-header">
                  <span>{{ plan.label }}</span>
                  <div class="radio-circle"></div>
                </div>
                <div class="card-body">
                  <span class="to-pay">To Pay</span>
                  <h4>INR {{ plan.price }}</h4>
                </div>
                <div class="card-footer">{{ plan.mode }} Session</div>
              </div>
            </div>
            <div class="action-container">
              <button class="pay-btn" [disabled]="!selectedPlan || paying" (click)="pay()">{{ paying ? 'Processing...' : 'PAY' }}</button>
            </div>
            <p *ngIf="message" style="margin-top:16px;text-align:center;color:#8c52ff;font-weight:600;">{{ message }}</p>
          </div>
        </div>
      </section>
    </main>

    <ng-template #profileUnavailable>
      <main class="profile-container">
        <section class="profile-details" style="max-width:820px;margin:0 auto;">
          <div class="details-card" style="text-align:center;">
            <h3>Profile is not available right now</h3>
            <p style="margin-bottom:24px;">This therapist could not be loaded yet. Please return to matches and try another default therapist.</p>
            <a routerLink="/matches" class="pay-btn" style="display:inline-block;text-decoration:none;">Back to Matches</a>
          </div>
        </section>
      </main>
    </ng-template>

    <div *ngIf="showSuccessPopup" style="position:fixed;inset:0;background:rgba(10,6,18,0.78);display:flex;align-items:center;justify-content:center;padding:20px;z-index:1000;">
      <div style="max-width:460px;width:100%;background:#fff;color:#160829;border-radius:24px;padding:32px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.35);">
        <h2 style="margin:0 0 12px;color:#8c52ff;">Payment Successful</h2>
        <p style="margin:0 0 10px;">Payment successful and your request has been sent to {{ therapist?.fullName }}.</p>
        <p style="margin:0;color:#5b5670;">Redirecting you to the dashboard so you can track approval and session details.</p>
      </div>
    </div>

    <app-footer></app-footer>
  `
})
export class TherapistProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly dataService = inject(DataService);
  private readonly bookingService = inject(BookingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  therapist: any;
  plans: any[] = [];
  selectedPlan: any;
  paying = false;
  message = '';
  showSuccessPopup = false;
  fallbackAvatar = 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png';
  readonly currentUser = this.authService.currentUser;

  /**
   * Loads the selected therapist. A local fallback is applied first so the
   * profile page still opens even if the API is slow or temporarily offline.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.therapist = findDefaultTherapist(id);
    this.plans = this.therapist?.therapistProfile?.consultationPlans || [];
    this.selectedPlan = this.plans[0];

    this.dataService.getTherapist(id).subscribe({
      next: ({ therapist }) => {
        this.therapist = therapist;
        this.plans = therapist?.therapistProfile?.consultationPlans || [];
        this.selectedPlan = this.selectedPlan || this.plans[0];
      },
      error: () => {
        this.message = 'Therapist profile could not be loaded right now.';
      }
    });
  }

  /**
   * Simulates payment, creates the appointment request, and redirects the user
   * to the dashboard where therapist approval status is visible.
   */
  pay(): void {
    const draft = this.bookingService.getDraft();
    if (!draft || !this.selectedPlan) {
      this.message = 'Please complete the booking form first.';
      return;
    }

    if (!this.authService.currentUser()) {
      this.router.navigate(['/signup']);
      return;
    }

    this.paying = true;
    this.dataService.createAppointment({
      therapistId: this.therapist._id || this.therapist.id,
      bookingForm: draft,
      selectedPlan: this.selectedPlan
    }).subscribe({
      next: ({ message }) => {
        this.message = message;
        this.bookingService.clearDraft();
        this.paying = false;
        this.showSuccessPopup = true;
        window.setTimeout(() => {
          this.showSuccessPopup = false;
          this.router.navigate(['/dashboard']);
        }, 1800);
      },
      error: (error) => {
        this.message = error.error?.message || error.message || 'Could not complete the appointment right now.';
        this.paying = false;
      }
    });
  }
}
