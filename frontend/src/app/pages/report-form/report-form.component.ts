import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-report-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    :host { display: block; }
    .report-page { min-height: 100vh; display: flex; flex-direction: column; background: #160829; color: #fff; }
    .top-header { text-align: center; padding: 30px 20px 20px; position: relative; }
    .close-btn { position: absolute; top: 30px; left: 40px; width: 40px; height: 40px; border-radius: 50%; border: 1px solid #8c52ff; background: transparent; color: #8c52ff; display: grid; place-items: center; text-decoration: none; }
    .main-title { color: #fbc02d; font-size: 28px; margin: 0; font-weight: 600; }
    .form-container { flex: 1; display: flex; justify-content: center; align-items: flex-start; padding: 20px; overflow-y: auto; }
    .form-card { background: #fff; color: #160829; width: min(900px, 100%); border-radius: 20px; padding: 30px 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .card-header { background: #160829; color: #fff; text-align: center; padding: 25px 20px; border-radius: 15px; margin-bottom: 30px; }
    .card-header h2 { margin: 0 0 8px; font-size: 22px; }
    .card-header p { margin: 0; font-size: 14px; color: #d1d1d1; }
    .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px 40px; }
    .full-width { grid-column: span 2; }
    .input-group { display: flex; flex-direction: column; }
    .input-group label { font-size: 14px; font-weight: 500; margin-bottom: 8px; }
    .input-group input, .input-group select { padding: 12px 15px; border: 1.5px solid #160829; border-radius: 8px; font-size: 14px; }
    .checkbox-group { display: flex; align-items: center; gap: 10px; margin-top: 15px; font-size: 14px; }
    .footer { background: #1a1037; padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #8c52ff; color: #fff; border: none; border-radius: 8px; padding: 12px 30px; font-size: 16px; cursor: pointer; min-width: 120px; }
    .btn[disabled] { opacity: 0.4; cursor: default; }
    .progress-bar { display: flex; align-items: center; }
    .circle { width: 35px; height: 35px; border-radius: 50%; background: #9e9e9e; color: #fff; display: grid; place-items: center; font-weight: bold; }
    .circle.active { background: #fbc02d; color: #160829; }
    .line-group { display: flex; align-items: center; gap: 8px; margin: 0 15px; }
    .line, .dot { background: #9e9e9e; }
    .line { width: 35px; height: 2px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; }
    .line-group.active .line, .line-group.active .dot { background: #fbc02d; }
    @media (max-width: 768px) {
      .input-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .progress-bar { display: none; }
      .close-btn { left: 20px; top: 20px; }
    }
  `],
  template: `
    <div class="report-page">
      <div class="top-header">
        <a class="close-btn" routerLink="/report-concern">X</a>
        <h1 class="main-title">{{ stepTitles[currentStep - 1] }}</h1>
      </div>

      <div class="form-container">
        <div class="form-card">
          <div class="card-header">
            <h2>Friend Welfare Report</h2>
            <p>Help us support someone you care about. Your report is a vital step toward their well-being.</p>
          </div>

          <div class="input-grid" *ngIf="currentStep === 1">
            <div class="input-group"><label>First name</label><input [(ngModel)]="friendDetails.firstName" name="friendFirstName" type="text"></div>
            <div class="input-group"><label>Last name</label><input [(ngModel)]="friendDetails.lastName" name="friendLastName" type="text"></div>
            <div class="input-group"><label>Gender</label><select [(ngModel)]="friendDetails.gender" name="friendGender"><option></option><option>Male</option><option>Female</option><option>Other</option></select></div>
            <div class="input-group"><label>Date of Birth</label><input [(ngModel)]="friendDetails.dateOfBirth" name="friendDob" type="date"></div>
            <div class="input-group"><label>Email</label><input [(ngModel)]="friendDetails.email" name="friendEmail" type="email"></div>
            <div class="input-group"><label>Hostel/Residency Status</label><input [(ngModel)]="friendDetails.residencyStatus" name="residencyStatus" type="text"></div>
            <div class="input-group full-width"><label>Current Emotional State</label><input [(ngModel)]="friendDetails.emotionalState" name="emotionalState" type="text" placeholder="Anxiety, Depression, or I'm not sure"></div>
            <div class="checkbox-group full-width"><input type="checkbox" id="report-terms"><label for="report-terms">Accept our Terms and Policies</label></div>
          </div>

          <div class="input-grid" *ngIf="currentStep === 2">
            <div class="input-group"><label>University/College Name</label><input [(ngModel)]="universityDetails.universityName" name="universityName" type="text"></div>
            <div class="input-group"><label>Student ID (Optional)</label><input [(ngModel)]="universityDetails.studentId" name="studentId" type="text"></div>
            <div class="input-group"><label>Current Year of Study</label><input [(ngModel)]="universityDetails.yearOfStudy" name="yearOfStudy" type="text"></div>
            <div class="input-group"><label>Course</label><input [(ngModel)]="universityDetails.course" name="course" type="text"></div>
            <div class="input-group full-width"><label>College Address</label><input [(ngModel)]="universityDetails.collegeAddress" name="collegeAddress" type="text"></div>
          </div>

          <div class="input-grid" *ngIf="currentStep === 3">
            <div class="input-group"><label>Relation to Student</label><select [(ngModel)]="guardianDetails.relationToStudent" name="relationToStudent"><option></option><option>Parent</option><option>Guardian</option><option>Mentor</option></select></div>
            <div class="input-group"><label>Contact Name</label><input [(ngModel)]="guardianDetails.contactName" name="contactName" type="text"></div>
            <div class="input-group"><label>Phone Number (optional)</label><input [(ngModel)]="guardianDetails.phoneNumber" name="guardianPhone" type="tel"></div>
            <div class="input-group"><label>Email Address (optional)</label><input [(ngModel)]="guardianDetails.emailAddress" name="guardianEmail" type="email"></div>
            <div class="input-group full-width"><label>Contact Address (optional)</label><input [(ngModel)]="guardianDetails.address" name="guardianAddress" type="text"></div>
          </div>

          <div class="input-grid" *ngIf="currentStep === 4">
            <div class="input-group"><label>Your Name</label><input [(ngModel)]="reporterDetails.reporterName" name="reporterName" type="text"></div>
            <div class="input-group"><label>Your Relationship to the Friend</label><input [(ngModel)]="reporterDetails.relationshipToFriend" name="relationshipToFriend" type="text"></div>
            <div class="input-group"><label>Your Contact Information</label><input [(ngModel)]="reporterDetails.contactInformation" name="contactInformation" type="text"></div>
            <div class="input-group"><label>Remain Anonymous?</label><select [(ngModel)]="reporterDetails.anonymous" name="anonymous"><option [ngValue]="true">Yes</option><option [ngValue]="false">No</option></select></div>
            <div class="input-group full-width"><label>Description of Concern</label><input [(ngModel)]="reporterDetails.description" name="description" type="text"></div>
          </div>
        </div>
      </div>

      <div class="footer">
        <button class="btn" (click)="changeStep(-1)" [disabled]="currentStep === 1">Previous</button>
        <div class="progress-bar">
          <ng-container *ngFor="let step of steps">
            <div class="circle" [class.active]="step <= currentStep">{{ step }}</div>
            <div class="line-group" *ngIf="step < totalSteps" [class.active]="step < currentStep">
              <div class="line"></div><div class="dot"></div><div class="line"></div>
            </div>
          </ng-container>
        </div>
        <button class="btn" (click)="changeStep(1)">{{ currentStep === totalSteps ? 'Submit' : 'Next' }}</button>
      </div>
    </div>
  `
})
export class ReportFormComponent {
  private readonly dataService = inject(DataService);
  private readonly router = inject(Router);
  readonly totalSteps = 4;
  readonly steps = [1, 2, 3, 4];
  readonly stepTitles = [
    'Personal Details of Friend',
    'University Details',
    'Parent, Guardian, or Mentor Details',
    'Reporter Details'
  ];
  currentStep = 1;
  friendDetails: any = {};
  universityDetails: any = {};
  guardianDetails: any = {};
  reporterDetails: any = {};

  changeStep(direction: number): void {
    if (direction === 1 && this.currentStep === this.totalSteps) {
      this.dataService.createConcern({
        friendDetails: this.friendDetails,
        universityDetails: this.universityDetails,
        guardianDetails: this.guardianDetails,
        reporterDetails: this.reporterDetails
      }).subscribe(() => {
        this.router.navigate(['/']);
      });
      return;
    }
    this.currentStep = Math.min(this.totalSteps, Math.max(1, this.currentStep + direction));
  }
}
