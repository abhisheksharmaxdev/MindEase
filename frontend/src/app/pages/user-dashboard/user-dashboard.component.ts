import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FooterComponent],
  styles: [`
    .page { min-height: 100vh; background:#0f0a1c; color:#fff; }
    .top-nav,.panel-card,.session-card,.profile-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); }
    .top-nav { display:flex; justify-content:space-between; align-items:center; padding:20px 32px; position:sticky; top:0; backdrop-filter:blur(14px); z-index:5; }
    .top-nav img { height:44px; }
    .top-links { display:flex; gap:16px; align-items:center; }
    .top-links a,.top-links button { color:#fff; text-decoration:none; background:none; border:none; cursor:pointer; }
    .container { max-width:1200px; margin:0 auto; padding:32px 20px 64px; display:grid; gap:24px; }
    .hero { display:grid; grid-template-columns:2fr 1fr; gap:24px; }
    .panel-card,.profile-card { border-radius:24px; padding:24px; }
    .panel-card h1 { margin:0 0 8px; font-size:2.4rem; }
    .panel-card .highlight { color:#f6c035; }
    .session-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(290px,1fr)); gap:20px; }
    .session-card { border-radius:20px; padding:20px; }
    .session-card h3 { margin:0 0 8px; color:#f6c035; }
    .session-card p { margin:8px 0; }
    .status { display:inline-block; padding:8px 12px; border-radius:999px; font-size:12px; background:#2d1c51; color:#c4a1ff; margin-top:12px; text-transform:capitalize; }
    .approved { background:#173621; color:#8af0a7; }
    .rejected { background:#38161f; color:#ff9db1; }
    .message-box { margin-top:14px; padding:14px; border-radius:16px; background:#130c23; border:1px solid rgba(140,82,255,0.3); }
    .message-box a { color:#f6c035; word-break:break-word; }
    .profile-card h2 { margin-top:0; }
    .profile-card form { display:grid; gap:12px; }
    .profile-card input { padding:12px 14px; border-radius:12px; border:1px solid #57427f; background:#130c23; color:#fff; }
    .profile-card button { border:none; border-radius:999px; padding:12px 18px; background:#8c52ff; color:#fff; cursor:pointer; font-weight:600; }
    .transactions { display:grid; gap:12px; }
    .transaction-item { display:flex; justify-content:space-between; gap:16px; padding:14px 18px; border-radius:16px; background:#130c23; }
    .transaction-copy { display:grid; gap:4px; }
    .transaction-copy small { color:#c5b8ea; }
    @media (max-width: 900px) { .hero { grid-template-columns:1fr; } .transaction-item { flex-direction:column; } }
  `],
  template: `
    <div class="page">
      <header class="top-nav">
        <a routerLink="/"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase"></a>
        <div class="top-links">
          <a routerLink="/matches">Your Matches</a>
          <a routerLink="/reviews">Reviews</a>
          <button (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="container">
        <section class="hero">
          <div class="panel-card">
            <h1>My <span class="highlight">Sessions</span></h1>
            <p>Track your therapist requests, approved sessions, payment records, and therapist messages.</p>
            <div class="session-grid" style="margin-top:24px;">
              <article class="session-card" *ngFor="let appointment of appointments">
                <h3>{{ appointment.therapist?.fullName }}</h3>
                <p><strong>Mode:</strong> {{ appointment.selectedPlan?.mode }}</p>
                <p><strong>Plan:</strong> {{ appointment.selectedPlan?.label }}</p>
                <p><strong>Paid:</strong> INR {{ appointment.selectedPlan?.price }}</p>
                <p *ngIf="appointment.status === 'approved' && appointment.therapistDecision?.scheduledFor">
                  <strong>Session:</strong> {{ appointment.therapistDecision?.scheduledFor }}
                </p>
                <p *ngIf="appointment.status === 'approved' && appointment.therapistDecision?.selectedSlot">
                  <strong>Time Slot:</strong> {{ appointment.therapistDecision?.selectedSlot }}
                </p>
                <p *ngIf="appointment.status === 'approved' && !appointment.therapistDecision?.scheduledFor">
                  Therapist approved your request and will share timing shortly.
                </p>
                <p *ngIf="appointment.status === 'pending_therapist'">Waiting for therapist to approve your appointment.</p>
                <p *ngIf="appointment.status === 'rejected'">The therapist declined this request. You can book another session anytime.</p>
                <div class="message-box" *ngIf="appointment.therapistDecision?.notes">
                  <strong>Therapist Message</strong>
                  <p style="margin:8px 0 0;white-space:pre-wrap;">{{ appointment.therapistDecision?.notes }}</p>
                </div>
                <span class="status" [class.approved]="appointment.status === 'approved'" [class.rejected]="appointment.status === 'rejected'">
                  {{ formatStatus(appointment.status) }}
                </span>
              </article>
            </div>
            <p *ngIf="!appointments.length" style="margin-top:24px;color:#d9cfff;">No sessions booked yet. Once you complete a booking and payment, your request will appear here.</p>
          </div>

          <aside class="profile-card">
            <h2>Profile</h2>
            <form (ngSubmit)="saveProfile()">
              <input [(ngModel)]="profile.fullName" name="fullName" placeholder="Full name" required>
              <input [value]="user?.email" placeholder="Email" disabled>
              <input [(ngModel)]="profile.phone" name="phone" placeholder="Phone number">
              <button type="submit">Update profile</button>
            </form>
          </aside>
        </section>

        <section class="panel-card">
          <h2 style="margin-top:0;">Transaction History</h2>
          <div class="transactions">
            <div class="transaction-item" *ngFor="let item of transactions">
              <div class="transaction-copy">
                <span>{{ item.label }} - {{ item.mode }}</span>
                <small *ngIf="item.transactionId">Transaction ID: {{ item.transactionId }}</small>
                <small>{{ item.paidAt ? formatPaidAt(item.paidAt) : 'Payment confirmed' }}</small>
              </div>
              <span>INR {{ item.amount }}</span>
            </div>
          </div>
          <p *ngIf="!transactions.length" style="color:#d9cfff;">No transactions yet.</p>
        </section>
      </main>

      <app-footer></app-footer>
    </div>
  `
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly dataService = inject(DataService);
  private refreshHandle: number | null = null;

  user = this.authService.currentUser();
  profile = { fullName: '', phone: '' };
  appointments: any[] = [];
  transactions: any[] = [];

  /**
   * Loads the signed-in user and keeps the session list refreshed so therapist
   * approvals and meeting links appear without requiring a new login.
   */
  ngOnInit(): void {
    const current = this.authService.currentUser();
    this.user = current;
    this.profile = { fullName: current?.fullName || '', phone: current?.phone || '' };
    this.loadAppointments();
    this.refreshHandle = window.setInterval(() => this.loadAppointments(), 15000);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) {
      window.clearInterval(this.refreshHandle);
    }
  }

  /**
   * Saves the light profile edits shown in the dashboard sidebar.
   */
  saveProfile(): void {
    this.authService.updateProfile(this.profile).subscribe(({ user }) => {
      this.user = user;
    });
  }

  formatStatus(status: string) {
    return status.replaceAll('_', ' ');
  }

  formatPaidAt(value: string) {
    return new Date(value).toLocaleString();
  }

  logout(): void {
    this.authService.logout();
  }

  private loadAppointments(): void {
    this.dataService.getMyAppointments().subscribe(({ appointments }) => {
      this.appointments = appointments;
      this.transactions = appointments.flatMap((appointment) =>
        (appointment.transactionHistory || []).map((item: any) => ({
          ...item,
          therapistName: appointment.therapist?.fullName || 'Therapist'
        }))
      );
    });
  }
}
