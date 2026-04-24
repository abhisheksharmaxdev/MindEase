import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-therapist-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .page { min-height:100vh; background:#11091f; color:#fff; padding:24px; }
    .shell { max-width:1340px; margin:0 auto; display:grid; gap:24px; }
    .topbar,.card,.stat,.profile-card { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:24px; }
    .topbar { padding:20px 24px; display:flex; justify-content:space-between; align-items:center; }
    .stats { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
    .stat { padding:20px; display:flex; justify-content:space-between; }
    .grid { display:grid; grid-template-columns:1.2fr 1fr; gap:24px; }
    .stack { display:grid; gap:24px; }
    .card, .profile-card { padding:20px; }
    .request { padding:16px; border-radius:18px; background:#170d2a; margin-bottom:14px; }
    .request p { margin:8px 0; }
    .actions { display:grid; gap:10px; margin-top:12px; }
    .action-row { display:flex; gap:10px; flex-wrap:wrap; }
    .actions button,.actions input,.actions textarea,.actions select { padding:10px 12px; border-radius:12px; border:none; }
    .accept { background:#2fbb74; color:#081b10; }
    .reject { background:#ff8a8a; color:#2b0a0a; }
    input, textarea, select { background:#231240; color:#fff; border:1px solid #4d2f81; width:100%; }
    textarea { min-height:110px; resize:vertical; }
    .message-preview { margin-top:10px; padding:12px; border-radius:14px; background:#231240; white-space:pre-wrap; }
    .meta { color:#d7c9ff; }
    .empty { color:#c7b9ea; padding:18px 0 6px; }
    .profile-card img { width:88px; height:88px; border-radius:50%; object-fit:cover; border:3px solid #8c52ff; }
    .pill { display:inline-block; padding:8px 12px; border-radius:999px; background:#231240; color:#f6c035; font-size:12px; margin-top:12px; }
    @media (max-width: 960px) { .grid,.stats { grid-template-columns:1fr; } }
  `],
  template: `
    <div class="page">
      <div class="shell">
        <header class="topbar">
          <div>
            <h1 style="margin:0;">Therapist Dashboard</h1>
            <p style="margin:6px 0 0;color:#d7c9ff;">Manage appointment requests and admin-assigned concerns.</p>
          </div>
          <div>
            <a routerLink="/" style="color:#fff;text-decoration:none;margin-right:16px;">Home</a>
            <button style="background:#8c52ff;color:#fff;padding:10px 16px;border:none;border-radius:999px;cursor:pointer;" (click)="logout()">Logout</button>
          </div>
        </header>

        <section class="grid">
          <div class="stack">
            <section class="stats">
              <div class="stat"><strong>Pending</strong><span>{{ dashboard?.stats?.pending || 0 }}</span></div>
              <div class="stat"><strong>Accepted</strong><span>{{ dashboard?.stats?.accepted || 0 }}</span></div>
              <div class="stat"><strong>Rejected</strong><span>{{ dashboard?.stats?.rejected || 0 }}</span></div>
            </section>

            <section class="card">
              <h2 style="margin-top:0;">User Requests</h2>
              <p class="meta">Current therapist: {{ dashboard?.therapist?.fullName }}</p>
              <article class="request" *ngFor="let appointment of dashboard?.appointments">
                <strong>{{ appointment.user?.fullName }}</strong>
                <p>{{ appointment.selectedPlan?.label }} - {{ appointment.selectedPlan?.mode }} - INR {{ appointment.selectedPlan?.price }}</p>
                <p><strong>Email:</strong> {{ appointment.user?.email }}</p>
                <p><strong>Phone:</strong> {{ appointment.user?.phone }}</p>
                <p><strong>Concerns:</strong> {{ (appointment.bookingForm?.therapyInfo?.concerns || []).join(', ') || 'Not provided' }}</p>
                <div class="actions" *ngIf="appointment.status === 'pending_therapist'">
                  <select [(ngModel)]="appointment.selectedSlot">
                    <option value="">Select available time slot</option>
                    <option *ngFor="let slot of availableSlots" [value]="slot">{{ slot }}</option>
                  </select>
                  <input [(ngModel)]="appointment.scheduledFor" type="datetime-local" placeholder="Session date and time">
                  <textarea [(ngModel)]="appointment.notes" placeholder="Add confirmation message or Google Meet link for the student"></textarea>
                  <div class="action-row">
                    <button class="accept" (click)="decideAppointment(appointment, 'accept')">Accept</button>
                    <button class="reject" (click)="decideAppointment(appointment, 'reject')">Reject</button>
                  </div>
                </div>
                <p *ngIf="appointment.status !== 'pending_therapist'">
                  Status: {{ appointment.status }}{{ appointment.therapistDecision?.scheduledFor ? ' - ' + appointment.therapistDecision.scheduledFor : '' }}
                </p>
                <p *ngIf="appointment.therapistDecision?.selectedSlot"><strong>Selected slot:</strong> {{ appointment.therapistDecision?.selectedSlot }}</p>
                <div class="message-preview" *ngIf="appointment.therapistDecision?.notes">
                  {{ appointment.therapistDecision?.notes }}
                </div>
              </article>
              <p class="empty" *ngIf="!dashboard?.appointments?.length">No appointment requests for this therapist yet.</p>
            </section>

            <section class="card">
              <h2 style="margin-top:0;">Assigned Concerns</h2>
              <article class="request" *ngFor="let concern of dashboard?.concerns">
                <strong>{{ concern.friendDetails?.firstName }} {{ concern.friendDetails?.lastName }}</strong>
                <p><strong>Concern:</strong> {{ concern.reporterDetails?.description }}</p>
                <p><strong>Reporter:</strong> {{ concern.reporterDetails?.reporterName }} ({{ concern.reporterDetails?.contactInformation }})</p>
                <p><strong>College:</strong> {{ concern.universityDetails?.universityName }}</p>
                <div class="actions" *ngIf="concern.status === 'assigned'">
                  <div class="action-row">
                    <button class="accept" (click)="decideConcern(concern, 'accept')">Accept</button>
                    <button class="reject" (click)="decideConcern(concern, 'reject')">Reject</button>
                  </div>
                </div>
                <p *ngIf="concern.status !== 'assigned'">Status: {{ concern.status }}</p>
              </article>
              <p class="empty" *ngIf="!dashboard?.concerns?.length">No admin-assigned concerns for this therapist yet.</p>
            </section>
          </div>

          <aside class="profile-card" *ngIf="dashboard?.therapist">
            <img [src]="dashboard.therapist.avatarUrl" [alt]="dashboard.therapist.fullName">
            <h2>{{ dashboard.therapist.fullName }}</h2>
            <p class="meta">{{ dashboard.therapist.therapistProfile?.qualification }}</p>
            <div class="pill">{{ dashboard.therapist.therapistProfile?.experienceText }}</div>
            <p style="margin-top:16px;"><strong>Specializations:</strong> {{ (dashboard.therapist.therapistProfile?.specializations || []).join(', ') }}</p>
            <p><strong>Languages:</strong> {{ (dashboard.therapist.therapistProfile?.languages || []).join(', ') }}</p>
            <p><strong>Bio:</strong> {{ dashboard.therapist.therapistProfile?.bio }}</p>
          </aside>
        </section>
      </div>
    </div>
  `
})
export class TherapistDashboardComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DataService);
  private readonly authService = inject(AuthService);
  private refreshHandle: number | null = null;
  private readonly onFocus = () => this.reload();
  dashboard: any;
  readonly availableSlots = [
    '10:00 AM - 11:00 AM',
    '11:30 AM - 12:30 PM',
    '2:00 PM - 3:00 PM',
    '4:00 PM - 5:00 PM',
    '6:00 PM - 7:00 PM'
  ];

  ngOnInit(): void {
    this.reload();
    this.refreshHandle = window.setInterval(() => this.reload(), 10000);
    window.addEventListener('focus', this.onFocus);
  }

  ngOnDestroy(): void {
    if (this.refreshHandle !== null) {
      window.clearInterval(this.refreshHandle);
    }

    window.removeEventListener('focus', this.onFocus);
  }

  reload(): void {
    this.dataService.getTherapistDashboard().subscribe((dashboard) => {
      this.dashboard = dashboard;
    });
  }

  decideAppointment(appointment: any, action: 'accept' | 'reject') {
    this.dataService.decideAppointment(appointment._id, {
      action,
      selectedSlot: appointment.selectedSlot || '',
      scheduledFor: appointment.scheduledFor || '',
      notes: appointment.notes || ''
    }).subscribe(() => this.reload());
  }

  decideConcern(concern: any, action: 'accept' | 'reject') {
    this.dataService.decideConcern(concern._id, { action }).subscribe(() => this.reload());
  }

  logout(): void {
    this.authService.logout();
  }
}
