import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-therapist-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host { display: block; }
    .auth-page { min-height: 100vh; background: #120822; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
    .main-container { position: relative; width: 100%; max-width: 1180px; min-height: 760px; background: #fff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; }
    .form-container { position: absolute; top: 0; height: 100%; width: 65%; transition: all 0.6s ease-in-out; padding: 48px 64px; display: flex; flex-direction: column; justify-content: center; overflow-y: auto; background: #fff; }
    .sign-in-container { left: 0; opacity: 1; z-index: 2; }
    .sign-up-container { left: 35%; opacity: 0; z-index: 1; pointer-events: none; }
    .overlay-container { position: absolute; top: 0; left: 65%; width: 35%; height: 100%; background: #0d0617; transition: all 0.6s ease-in-out; z-index: 10; overflow: hidden; }
    .overlay-panel { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 50px 30px; color: #fff; transition: opacity 0.4s ease-in-out; }
    .overlay-signup { opacity: 0; pointer-events: none; }
    .main-container.right-panel-active .sign-in-container { left: 35%; opacity: 0; pointer-events: none; }
    .main-container.right-panel-active .sign-up-container { left: 35%; opacity: 1; z-index: 5; pointer-events: auto; }
    .main-container.right-panel-active .overlay-container { left: 0; }
    .main-container.right-panel-active .overlay-login { opacity: 0; pointer-events: none; }
    .main-container.right-panel-active .overlay-signup { opacity: 1; }
    .form-header { text-align: center; margin-bottom: 32px; }
    .form-header h1 { color: #8c52ff; font-size: 32px; margin-bottom: 12px; }
    .form-header p { color: #9ca3af; font-size: 15px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }
    .full-width { grid-column: span 2; }
    .input-group { margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }
    .input-group input, .input-group textarea { width: 100%; padding: 16px 24px; border: 1.5px solid #8c52ff; border-radius: 30px; font-size: 14px; }
    .input-group textarea { min-height: 96px; border-radius: 18px; resize: vertical; }
    .password-row { display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
    .password-row input { width: 100%; }
    .forgot-link, .switch-link a, .checkbox-group a { color: #fbc02d; text-decoration: none; font-weight: 600; cursor: pointer; }
    .forgot-link { text-align: right; }
    .checkbox-group { display: flex; align-items: center; gap: 10px; margin-top: 12px; margin-bottom: 24px; font-size: 14px; color: #9ca3af; }
    .submit-btn { background: #8c52ff; color: #fff; border: none; border-radius: 30px; padding: 16px 40px; font-size: 16px; font-weight: 600; cursor: pointer; display: block; margin: 0 auto; min-width: 180px; }
    .switch-link { text-align: center; margin-top: 20px; font-size: 14px; color: #9ca3af; }
    .logo { display: flex; justify-content: center; margin-bottom: 30px; }
    .logo img { width: 150px; }
    .illustration-container { width: 100%; display: flex; justify-content: center; margin-bottom: 24px; }
    .illustration-container img { width: 100%; max-width: 220px; }
    .overlay-panel h2 { color: #fbc02d; font-size: 22px; margin-bottom: 10px; }
    .overlay-panel h3 { color: #fbc02d; font-size: 20px; margin-bottom: 15px; }
    .overlay-panel p, .page-footer { color: #d1d5db; }
    .page-footer { margin-top: 40px; font-size: 14px; display: flex; gap: 8px; }
    .page-footer .highlight { color: #fbc02d; }
    .helper-box { margin-top: 16px; border-radius: 18px; padding: 14px 16px; background: #f7f3ff; color: #4a3578; font-size: 13px; }
    @media (max-width: 960px) {
      .main-container { min-height: 1260px; display: flex; flex-direction: column; overflow: visible; background: transparent; box-shadow: none; }
      .form-container, .overlay-container { position: relative; width: 100%; left: 0 !important; }
      .form-container { border-radius: 20px; padding: 40px 30px; order: 2; margin-top: 20px; }
      .overlay-container { border-radius: 20px; min-height: 400px; order: 1; }
      .sign-up-container { display: none; }
      .main-container.right-panel-active .sign-in-container { display: none; }
      .main-container.right-panel-active .sign-up-container { display: flex; }
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
    }
  `],
  template: `
    <div class="auth-page">
      <div class="main-container" [class.right-panel-active]="showSignUp">
        <div class="form-container sign-in-container">
          <div class="form-header">
            <h1>Welcome Back to MindEase</h1>
            <p>Log in with an approved therapist account to manage appointment requests</p>
          </div>
          <form (ngSubmit)="login()">
            <div class="input-group full-width"><input [(ngModel)]="loginForm.email" name="loginEmail" type="email" placeholder="Enter Your Email" required></div>
            <div class="input-group password-row full-width">
              <input [(ngModel)]="loginForm.password" name="loginPassword" type="password" placeholder="Enter Your Password" required>
              <a href="#" class="forgot-link">Forgot Password ?</a>
            </div>
            <div class="checkbox-group"><input type="checkbox" id="therapist-remember"><label for="therapist-remember">Remember Me</label></div>
            <button type="submit" class="submit-btn">Log In</button>
          </form>
          <div class="helper-box">
            Default therapist accounts are already approved. New therapist signups must be approved by admin before login.
          </div>
          <div class="switch-link">Want to join as therapist? <a (click)="showSignUp = true">Apply Now</a></div>
        </div>

        <div class="form-container sign-up-container">
          <div class="form-header">
            <h1>Therapist Application</h1>
            <p>Submit your profile and resume for admin review</p>
          </div>
          <form (ngSubmit)="signup()">
            <div class="form-grid">
              <div class="input-group"><input [(ngModel)]="signupForm.fullName" name="fullName" type="text" placeholder="Full Name" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.email" name="email" type="email" placeholder="Email Address" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.phone" name="phone" type="tel" placeholder="Phone Number" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.qualification" name="qualification" type="text" placeholder="Qualification" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.experienceText" name="experienceText" type="text" placeholder="Experience (eg. 2 years)" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.languages" name="languages" type="text" placeholder="Languages (comma separated)" required></div>
              <div class="input-group full-width"><input [(ngModel)]="signupForm.specializations" name="specializations" type="text" placeholder="Specializations (comma separated)" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.password" name="password" type="password" placeholder="Password" required></div>
              <div class="input-group"><input [(ngModel)]="signupForm.confirmPassword" name="confirmPassword" type="password" placeholder="Confirm Password" required></div>
              <div class="input-group full-width"><textarea [(ngModel)]="signupForm.bio" name="bio" placeholder="Short professional bio" required></textarea></div>
              <div class="input-group full-width">
                <label style="font-size:14px;color:#6b7280;">Upload Resume (PDF or DOC)</label>
                <input name="resume" type="file" accept=".pdf,.doc,.docx" (change)="onResumeSelected($event)" required>
                <small *ngIf="selectedResumeName" style="color:#6b7280;">Selected file: {{ selectedResumeName }}</small>
              </div>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="therapist-terms" required>
              <label for="therapist-terms">I confirm the information is correct and ready for admin review.</label>
            </div>
            <button type="submit" class="submit-btn">Submit Application</button>
          </form>
          <div class="switch-link">Already approved? <a (click)="showSignUp = false">Log In</a></div>
        </div>

        <div class="overlay-container">
          <div class="overlay-panel overlay-login">
            <div class="logo"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo"></div>
            <div class="illustration-container"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776101728/SIH_image_52_o1ep8x.png" alt="MindEase illustration"></div>
            <h2>Welcome back!</h2>
            <h3>Your support continues</h3>
            <p>Approved therapists receive booking requests and admin-assigned concerns directly in the dashboard.</p>
          </div>
          <div class="overlay-panel overlay-signup">
            <div class="logo"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo"></div>
            <div class="illustration-container"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776101728/SIH_image_52_o1ep8x.png" alt="MindEase illustration"></div>
            <h2>Join the therapist network</h2>
            <h3>Admin approval required</h3>
            <p>Your resume and profile will appear in the admin dashboard for review.</p>
          </div>
        </div>
      </div>

      <div class="page-footer">
        <div>&copy; 2026</div>
        <span class="highlight">MindEase</span> All rights reserved | Designed & Developed by <span class="highlight">Sharma Abhishek</span>
      </div>
      <p *ngIf="message" style="margin-top:16px;color:#fbc02d;">{{ message }}</p>
    </div>
  `
})
export class TherapistAuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showSignUp = false;
  loginForm = { email: '', password: '' };
  signupForm = {
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    experienceText: '',
    languages: '',
    specializations: '',
    bio: '',
    password: '',
    confirmPassword: ''
  };
  resumeFile: File | null = null;
  selectedResumeName = '';
  message = '';

  private getAuthErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.status === 0) {
      return 'MindEase server is not running. Please start backend and try again.';
    }

    return fallback;
  }

  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] || null;

    if (!file) {
      this.resumeFile = null;
      this.selectedResumeName = '';
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || '';
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedExtensions.includes(extension)) {
      this.resumeFile = null;
      this.selectedResumeName = '';
      input.value = '';
      this.message = 'Please upload a PDF, DOC, or DOCX resume.';
      return;
    }

    if (file.size > maxFileSize) {
      this.resumeFile = null;
      this.selectedResumeName = '';
      input.value = '';
      this.message = 'Resume size should be 5 MB or less.';
      return;
    }

    this.resumeFile = file;
    this.selectedResumeName = file.name;
    this.message = '';
  }

  /**
   * Opens the approved therapist dashboard in a new tab after successful login.
   */
  login(): void {
    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.authService.createTabHandoff(response);
        const dashboardUrl = this.router.serializeUrl(this.router.createUrlTree(['/therapist-dashboard'], { queryParams: { handoff: 1 } }));
        window.open(dashboardUrl, '_blank');
      },
      error: (error) => {
        this.message = this.getAuthErrorMessage(error, 'Unable to sign in.');
      }
    });
  }

  /**
   * Submits a therapist application with resume data for admin review.
   */
  signup(): void {
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    if (!this.resumeFile) {
      this.message = 'Please upload your resume before submitting.';
      return;
    }

    const payload = new FormData();
    payload.append('fullName', this.signupForm.fullName);
    payload.append('email', this.signupForm.email);
    payload.append('phone', this.signupForm.phone);
    payload.append('qualification', this.signupForm.qualification);
    payload.append('experienceText', this.signupForm.experienceText);
    payload.append('languages', JSON.stringify(this.signupForm.languages.split(',').map((item) => item.trim()).filter(Boolean)));
    payload.append('specializations', JSON.stringify(this.signupForm.specializations.split(',').map((item) => item.trim()).filter(Boolean)));
    payload.append('bio', this.signupForm.bio);
    payload.append('password', this.signupForm.password);
    payload.append('resume', this.resumeFile);

    this.authService.registerTherapist(payload).subscribe({
      next: ({ message }) => {
        this.message = message;
        this.resumeFile = null;
        this.selectedResumeName = '';
        this.showSignUp = false;
      },
      error: (error) => {
        this.message = this.getAuthErrorMessage(error, 'Unable to submit therapist application.');
      }
    });
  }
}