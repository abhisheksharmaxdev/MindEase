import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_BASE_URL } from '../../core/services/api.config';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    .page { min-height:100vh; background:#10081d; color:#fff; padding:24px; }
    .shell { max-width:1380px; margin:0 auto; display:grid; gap:24px; }
    .topbar,.card,.stat { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:24px; }
    .topbar { padding:20px 24px; display:flex; justify-content:space-between; align-items:center; }
    .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
    .stat { padding:20px; display:flex; justify-content:space-between; }
    .card { padding:20px; overflow:auto; }
    table { width:100%; border-collapse:collapse; min-width:950px; }
    th, td { text-align:left; padding:12px 10px; border-bottom:1px solid rgba(255,255,255,0.08); vertical-align:top; }
    th { color:#f6c035; font-weight:700; }
    .assign-panel, .review-panel { display:grid; gap:8px; }
    select, textarea, button { border:none; border-radius:12px; padding:10px 12px; }
    select, textarea { background:#241042; color:#fff; border:1px solid #4d2f81; width:100%; }
    textarea { min-height:84px; resize:vertical; }
    button { background:#8c52ff; color:#fff; cursor:pointer; }
    .secondary { background:#3b244f; }
    .grid { display:grid; grid-template-columns:1fr; gap:24px; }
    .small { color:#d5c7f5; font-size:13px; }
    .resume-link { color:#f6c035; text-decoration:none; }
    @media (max-width: 960px) { .stats { grid-template-columns:1fr; } }
  `],
  template: `
    <div class="page">
      <div class="shell">
        <header class="topbar">
          <div>
            <h1 style="margin:0;">Admin Dashboard</h1>
            <p style="margin:6px 0 0;color:#d5c7f5;">Monitor reported concerns, therapist applications, and appointment activity.</p>
          </div>
          <div>
            <a routerLink="/" style="color:#fff;text-decoration:none;margin-right:16px;">Home</a>
            <button (click)="logout()">Logout</button>
          </div>
        </header>

        <section class="stats">
          <div class="stat"><strong>Total Concerns</strong><span>{{ concerns.length }}</span></div>
          <div class="stat"><strong>Total Appointments</strong><span>{{ appointments.length }}</span></div>
          <div class="stat"><strong>Pending Concerns</strong><span>{{ pendingConcerns }}</span></div>
          <div class="stat"><strong>Therapist Applications</strong><span>{{ therapistApplications.length }}</span></div>
        </section>

        <section class="card">
          <h2 style="margin-top:0;">Default Therapists</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Qualification</th>
                <th>Specializations</th>
                <th>Active Cases</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let therapist of therapists">
                <td>{{ therapist.fullName }}</td>
                <td>{{ therapist.email }}</td>
                <td>{{ therapist.therapistProfile?.qualification }}</td>
                <td>{{ (therapist.therapistProfile?.specializations || []).join(', ') }}</td>
                <td>{{ therapist.activeCases || 0 }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card">
          <h2 style="margin-top:0;">Reported Concerns</h2>
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Reporter</th>
                <th>University</th>
                <th>Guardian</th>
                <th>Status</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let concern of concerns">
                <td>
                  <div>{{ concern.friendDetails?.firstName }} {{ concern.friendDetails?.lastName }}</div>
                  <div class="small">{{ concern.friendDetails?.email }}</div>
                  <div class="small">Gender: {{ concern.friendDetails?.gender }}</div>
                  <div class="small">DOB: {{ concern.friendDetails?.dateOfBirth }}</div>
                  <div class="small">Residency: {{ concern.friendDetails?.residencyStatus }}</div>
                  <div class="small">Emotional State: {{ concern.friendDetails?.emotionalState }}</div>
                </td>
                <td>
                  <div>{{ concern.reporterDetails?.reporterName }}</div>
                  <div class="small">{{ concern.reporterDetails?.relationshipToFriend }}</div>
                  <div class="small">{{ concern.reporterDetails?.contactInformation }}</div>
                  <div class="small">Anonymous: {{ concern.reporterDetails?.anonymous ? 'Yes' : 'No' }}</div>
                  <div class="small">Concern: {{ concern.reporterDetails?.description }}</div>
                </td>
                <td>
                  <div>{{ concern.universityDetails?.universityName }}</div>
                  <div class="small">Student ID: {{ concern.universityDetails?.studentId || 'N/A' }}</div>
                  <div class="small">Year: {{ concern.universityDetails?.yearOfStudy }}</div>
                  <div class="small">Course: {{ concern.universityDetails?.course }}</div>
                  <div class="small">Address: {{ concern.universityDetails?.collegeAddress }}</div>
                </td>
                <td>
                  <div>{{ concern.guardianDetails?.contactName || 'N/A' }}</div>
                  <div class="small">{{ concern.guardianDetails?.relationToStudent || 'N/A' }}</div>
                  <div class="small">{{ concern.guardianDetails?.phoneNumber || 'N/A' }}</div>
                  <div class="small">{{ concern.guardianDetails?.emailAddress || 'N/A' }}</div>
                  <div class="small">{{ concern.guardianDetails?.address || 'N/A' }}</div>
                </td>
                <td>
                  <div>{{ concern.status }}</div>
                  <div class="small" *ngIf="concern.assignedTherapist">Assigned to {{ concern.assignedTherapist.fullName }}</div>
                </td>
                <td>
                  <div class="assign-panel" *ngIf="concern.status === 'pending'; else assignedInfo">
                    <select [value]="selectedTherapists[concern._id] || ''" (change)="selectedTherapists[concern._id] = $any($event.target).value">
                      <option value="">Select therapist</option>
                      <option *ngFor="let therapist of therapists" [value]="therapist._id">
                        {{ therapist.fullName }} ({{ therapist.activeCases || 0 }} active cases)
                      </option>
                    </select>
                    <button (click)="assignConcern(concern)">Assign</button>
                  </div>
                  <ng-template #assignedInfo>
                    <span class="small">Already assigned</span>
                  </ng-template>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card">
          <h2 style="margin-top:0;">Therapist Applications</h2>
          <table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Profile</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let therapist of therapistApplications">
                <td>
                  <div>{{ therapist.fullName }}</div>
                  <div class="small">{{ therapist.email }}</div>
                  <div class="small">{{ therapist.phone }}</div>
                </td>
                <td>
                  <div>{{ therapist.therapistProfile?.qualification }}</div>
                  <div class="small">{{ therapist.therapistProfile?.experienceText }}</div>
                  <div class="small">Languages: {{ (therapist.therapistProfile?.languages || []).join(', ') }}</div>
                  <div class="small">Specializations: {{ (therapist.therapistProfile?.specializations || []).join(', ') }}</div>
                  <div class="small">{{ therapist.therapistProfile?.bio }}</div>
                </td>
                <td>
                  <a class="resume-link" *ngIf="therapist.therapistProfile?.resumeUrl" [href]="uploadBaseUrl + therapist.therapistProfile.resumeUrl" target="_blank">Open Resume</a>
                  <span class="small" *ngIf="!therapist.therapistProfile?.resumeUrl">No resume uploaded</span>
                </td>
                <td>{{ therapist.therapistProfile?.status }}</td>
                <td>
                  <div class="review-panel">
                    <textarea [(ngModel)]="reviewNotes[therapist._id]" placeholder="Admin notes"></textarea>
                    <button (click)="reviewTherapist(therapist, 'approve')">Approve</button>
                    <button class="secondary" (click)="reviewTherapist(therapist, 'reject')">Reject</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="!therapistApplications.length">
                <td colspan="5" class="small">No therapist applications submitted yet.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="card">
          <h2 style="margin-top:0;">Appointments Overview</h2>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Therapist</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Transaction</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let appointment of appointments">
                <td>{{ appointment.user?.fullName }}</td>
                <td>{{ appointment.therapist?.fullName }}</td>
                <td>{{ appointment.selectedPlan?.label }} - {{ appointment.selectedPlan?.mode }} - INR {{ appointment.selectedPlan?.price }}</td>
                <td>
                  <div>{{ appointment.status }}</div>
                  <div class="small" *ngIf="appointment.therapistDecision?.scheduledFor">Session: {{ appointment.therapistDecision?.scheduledFor }}</div>
                  <div class="small" *ngIf="appointment.therapistDecision?.notes">{{ appointment.therapistDecision?.notes }}</div>
                </td>
                <td>
                  <div *ngFor="let item of appointment.transactionHistory || []" class="small">
                    {{ item.label }} | {{ item.mode }} | INR {{ item.amount }} | {{ item.status }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private readonly dataService = inject(DataService);
  private readonly authService = inject(AuthService);
  private refreshHandle: number | null = null;
  private readonly onFocus = () => this.reload();

  concerns: any[] = [];
  therapists: any[] = [];
  appointments: any[] = [];
  therapistApplications: any[] = [];
  selectedTherapists: Record<string, string> = {};
  reviewNotes: Record<string, string> = {};
  readonly uploadBaseUrl = API_BASE_URL.replace(/\/api$/, '');

  get pendingConcerns() {
    return this.concerns.filter((concern) => concern.status === 'pending').length;
  }

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

  assignConcern(concern: any): void {
    const therapistId = this.selectedTherapists[concern._id];
    if (!therapistId) {
      return;
    }

    this.dataService.assignConcern(concern._id, therapistId).subscribe(() => this.reload());
  }

  reviewTherapist(therapist: any, action: 'approve' | 'reject'): void {
    this.dataService.reviewTherapist(therapist._id, {
      action,
      adminNotes: this.reviewNotes[therapist._id] || ''
    }).subscribe(() => this.reload());
  }

  logout(): void {
    this.authService.logout();
  }

  private reload(): void {
    this.dataService.getAdminDashboard().subscribe((dashboard) => {
      this.concerns = dashboard.concerns || [];
      this.therapists = dashboard.therapists || [];
      this.appointments = dashboard.appointments || [];
      this.therapistApplications = dashboard.therapistApplications || [];
    });
  }
}
