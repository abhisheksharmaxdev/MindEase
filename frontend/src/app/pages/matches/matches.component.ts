import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DEFAULT_THERAPISTS } from '../../core/data/default-therapists';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/matches.css'],
  template: `
    <header class="top-header">
      <div class="logo-container">
        <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo" class="logo">
      </div>
      <h1 class="page-title">Your Matches</h1>
      <nav class="nav-container">
        <a routerLink="/" class="nav-link">Home</a>
        <a routerLink="/dashboard" class="user-avatar">{{ (currentUser()?.fullName?.slice(0, 2) || 'ME').toUpperCase() }}</a>
      </nav>
    </header>

    <main class="matches-container">
      <div class="card-grid" *ngIf="therapists.length; else emptyState">
        <article class="therapist-card" *ngFor="let therapist of therapists">
          <div class="card-profile">
            <div class="avatar-ring">
              <img [src]="therapist.therapistProfile?.avatarUrl || therapist.avatarUrl || fallbackAvatar" [alt]="therapist.fullName">
            </div>
            <div class="profile-info">
              <h2>{{ therapist.fullName }}</h2>
              <p>{{ therapist.therapistProfile?.gender || 'Therapist' }}</p>
            </div>
          </div>

          <div class="expertise-box">
            <h3>Top Areas of Expertise</h3>
            <div class="tags-container">
              <span class="tag" *ngFor="let tag of therapist.therapistProfile?.specializations || []">{{ tag }}</span>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <h4>Experience</h4>
              <p>{{ therapist.therapistProfile?.experienceText || 'New therapist' }}</p>
            </div>
            <div class="stat-box text-right">
              <h4>Starting Price</h4>
              <p>{{ getStartingPrice(therapist) }}</p>
            </div>
          </div>

          <button class="btn-primary" [routerLink]="['/therapists', therapist._id || therapist.id]">
            Select Therapist
            <span class="arrow">&gt;</span>
          </button>

          <div class="qualification-section">
            <h4>Qualification</h4>
            <span class="tag tag-dark">{{ therapist.therapistProfile?.qualification || 'Psychology Specialist' }}</span>
          </div>

          <a [routerLink]="['/therapists', therapist._id || therapist.id]" class="btn-outline">View Details</a>
        </article>
      </div>
      <ng-template #emptyState>
        <div style="max-width:760px;width:100%;background:#fff;color:#160829;border-radius:24px;padding:32px;text-align:center;">
          <h2 style="margin-top:0;color:#8c52ff;">No therapist matches found yet</h2>
          <p>The page is now designed for the three default therapists only. Restart the backend once so those profiles seed and appear here.</p>
          <a routerLink="/book-appointment" class="btn-outline" style="display:inline-block;width:auto;margin-top:12px;">Back to booking</a>
        </div>
      </ng-template>
    </main>

    <app-footer></app-footer>
  `
})
export class MatchesComponent implements OnInit {
  private readonly dataService = inject(DataService);
  private readonly authService = inject(AuthService);
  therapists: any[] = [];
  fallbackAvatar = 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018084/SIH_image_24_trnafw.png';
  readonly fallbackTherapists = DEFAULT_THERAPISTS;
  readonly currentUser = this.authService.currentUser;

  /**
   * Loads the fixed therapist list used by the appointment flow.
   */
  ngOnInit(): void {
    this.therapists = this.fallbackTherapists;

    this.dataService.getTherapists().subscribe({
      next: ({ therapists }) => {
        if (therapists?.length) {
          this.therapists = therapists;
        }
      },
      error: () => {
        this.therapists = this.fallbackTherapists;
      }
    });
  }

  getStartingPrice(therapist: any): string {
    const prices = (therapist.therapistProfile?.consultationPlans || []).map((plan: any) => plan.price);
    if (!prices.length) return 'N/A';
    return `INR ${Math.min(...prices)}`;
  }
}
