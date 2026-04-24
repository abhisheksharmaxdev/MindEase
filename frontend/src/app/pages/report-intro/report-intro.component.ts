import { Component, ViewEncapsulation, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-report-intro',
  standalone: true,
  imports: [RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/report-intro.css'],
  template: `
    <header class="top-nav">
      <a routerLink="/" class="nav-link">Home</a>
      <a routerLink="/dashboard" class="user-avatar">{{ initials }}</a>
    </header>

    <main class="hero-container">
      <section class="hero-visual">
        <div class="illustration-card report-illustration"></div>
      </section>
      <section class="hero-content">
        <h1>Reporting a <span class="highlight">concern</span> is just a few steps away.</h1>
        <div class="subtext">
          <p>Provide these details so we can direct your concern to the proper authorities.</p>
          <p class="highlight-italic">We take all concerns seriously. Your safety and confidentiality are our priorities.</p>
        </div>
        <a routerLink="/report-form" class="cta-button">
          Let's Begin
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </a>
      </section>
    </main>

    <app-footer></app-footer>
  `
})
export class ReportIntroComponent {
  private readonly authService = inject(AuthService);
  readonly initials = (this.authService.currentUser()?.fullName?.slice(0, 2) || 'ME').toUpperCase();
}
