import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host { display: block; }
    .auth-page { min-height: 100vh; background: #120822; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
    .main-container { position: relative; width: 100%; max-width: 1100px; min-height: 700px; background: #fff; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); overflow: hidden; }
    .form-container { position: absolute; top: 0; height: 100%; width: 65%; transition: all 0.6s ease-in-out; padding: 60px 80px; display: flex; flex-direction: column; justify-content: center; overflow-y: auto; background: #fff; }
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
    .form-header { text-align: center; margin-bottom: 40px; }
    .form-header h1 { color: #8c52ff; font-size: 32px; margin-bottom: 12px; }
    .form-header p { color: #9ca3af; font-size: 15px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .full-width { grid-column: span 2; }
    .input-group { margin-bottom: 25px; display: flex; flex-direction: column; }
    .input-group input, .phone-group select { width: 100%; padding: 16px 24px; border: 1.5px solid #8c52ff; border-radius: 30px; font-size: 14px; }
    .password-row { display: flex; flex-direction: column; align-items: stretch; gap: 12px; }
    .password-row input { width: 100%; }
    .phone-group { display: flex; gap: 15px; grid-column: span 2; }
    .phone-group select { width: 100px; padding: 0 15px; }
    .forgot-link, .switch-link a, .checkbox-group a { color: #fbc02d; text-decoration: none; font-weight: 600; cursor: pointer; }
    .forgot-link { text-align: right; }
    .checkbox-group { display: flex; align-items: center; gap: 10px; margin-top: 15px; margin-bottom: 30px; font-size: 14px; color: #9ca3af; }
    .submit-btn { background: #8c52ff; color: #fff; border: none; border-radius: 30px; padding: 16px 40px; font-size: 16px; font-weight: 600; cursor: pointer; display: block; margin: 0 auto; min-width: 180px; }
    .switch-link { text-align: center; margin-top: 25px; font-size: 14px; color: #9ca3af; }
    .logo { display: flex; justify-content: center; margin-bottom: 30px; }
    .logo img { width: 150px; }
    .illustration-container { width: 100%; display: flex; justify-content: center; margin-bottom: 30px; }
    .illustration-container img { width: 100%; max-width: 220px; }
    .overlay-panel h2 { color: #fbc02d; font-size: 22px; margin-bottom: 10px; }
    .overlay-panel h3 { color: #fbc02d; font-size: 20px; margin-bottom: 15px; }
    .overlay-panel p, .page-footer { color: #d1d5db; }
    .page-footer { margin-top: 40px; font-size: 14px; display: flex; gap: 8px; }
    .page-footer .highlight { color: #fbc02d; }
    @media (max-width: 960px) {
      .main-container { min-height: 1000px; display: flex; flex-direction: column; overflow: visible; background: transparent; box-shadow: none; }
      .form-container, .overlay-container { position: relative; width: 100%; left: 0 !important; }
      .form-container { border-radius: 20px; padding: 40px 30px; order: 2; margin-top: 20px; }
      .overlay-container { border-radius: 20px; min-height: 400px; order: 1; }
      .sign-up-container { display: none; }
      .main-container.right-panel-active .sign-in-container { display: none; }
      .main-container.right-panel-active .sign-up-container { display: flex; }
      .password-row { flex-direction: column; align-items: stretch; }
      .password-row input { width: 100%; }
      .phone-group { grid-column: span 1; }
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
            <p>Continue your confidential journey to well-being</p>
          </div>
          <form (ngSubmit)="login()">
            <div class="input-group"><input [(ngModel)]="loginForm.email" name="loginEmail" type="email" placeholder="Enter Your Email" required></div>
            <div class="input-group password-row">
              <input [(ngModel)]="loginForm.password" name="loginPassword" type="password" placeholder="Enter Your Password" required>
              <a href="#" class="forgot-link">Forgot Password ?</a>
            </div>
            <div class="checkbox-group"><input type="checkbox" id="remember"><label for="remember">Remember Me</label></div>
            <button type="submit" class="submit-btn">Log In</button>
          </form>
          <div class="switch-link">Don't Have an account? <a (click)="showSignUp = true">Sign Up</a></div>
        </div>

        <div class="form-container sign-up-container">
          <div class="form-header">
            <h1>Create Your MindEase Account</h1>
            <p>Your confidential journey to well-being begins here</p>
          </div>
          <form (ngSubmit)="signup()">
            <div class="form-grid">
              <div class="input-group full-width" style="margin-bottom:0;"><input [(ngModel)]="signupForm.fullName" name="fullName" type="text" placeholder="Full Name" required></div>
              <div class="input-group full-width" style="margin-bottom:0;"><input [(ngModel)]="signupForm.email" name="email" type="email" placeholder="Enter Your Email" required></div>
              <div class="phone-group">
                <select><option>+91</option><option>+1</option><option>+44</option></select>
                <div class="input-group" style="flex:1;margin-bottom:0;"><input [(ngModel)]="signupForm.phone" name="phone" type="tel" placeholder="Phone Number" required></div>
              </div>
              <div class="input-group" style="margin-bottom:0;"><input [(ngModel)]="signupForm.password" name="password" type="password" placeholder="Password" required></div>
              <div class="input-group" style="margin-bottom:0;"><input [(ngModel)]="signupForm.confirmPassword" name="confirmPassword" type="password" placeholder="Re-Enter Password" required></div>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="terms" required>
              <label for="terms">I agree to MindEase's <a href="/terms-and-conditions">Terms of Service</a> & <a href="/privacy-policy">Privacy Policy</a>.</label>
            </div>
            <button type="submit" class="submit-btn">Create Account</button>
          </form>
          <div class="switch-link">Already have an account? <a (click)="showSignUp = false">Log In</a></div>
        </div>

        <div class="overlay-container">
          <div class="overlay-panel overlay-login">
            <div class="logo"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo"></div>
            <div class="illustration-container"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018101/SIH_image_51_djhlkh.png" alt="MindEase Brain Illustration"></div>
            <h2>Welcome back!</h2>
            <h3>Your journey continues</h3>
            <p>Access your confidential space for peace and growth</p>
          </div>
          <div class="overlay-panel overlay-signup">
            <div class="logo"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo"></div>
            <div class="illustration-container"><img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018082/SIH_image_28_gm6bqy.png" alt="MindEase illustration"></div>
            <h2>Your confidential journey<br>starts here.</h2>
            <p style="margin-top: 15px;">Embark on a path to a calmer, stronger mind</p>
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
export class AuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  showSignUp = false;
  loginForm = { email: '', password: '' };
  signupForm = { fullName: '', email: '', phone: '', password: '', confirmPassword: '' };
  message = '';

  /**
   * Converts backend and network errors into a clearer auth message for users.
   */
  private getAuthErrorMessage(error: any, fallback: string): string {
    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.status === 0) {
      return 'MindEase server is not running. Please start backend and try again.';
    }

    return fallback;
  }

  login(): void {
    this.authService.login(this.loginForm).subscribe({
      next: ({ user }) => {
        if (user.role === 'therapist') {
          this.router.navigate(['/therapist-dashboard']);
          return;
        }
        if (user.role === 'admin') {
          this.router.navigate(['/admin-dashboard']);
          return;
        }
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.message = this.getAuthErrorMessage(error, 'Unable to sign in.');
      }
    });
  }

  signup(): void {
    if (this.signupForm.password !== this.signupForm.confirmPassword) {
      this.message = 'Passwords do not match.';
      return;
    }

    this.authService.registerUser({
      fullName: this.signupForm.fullName,
      email: this.signupForm.email,
      phone: this.signupForm.phone,
      password: this.signupForm.password
    }).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (error) => {
        this.message = this.getAuthErrorMessage(error, 'Unable to create account.');
      }
    });
  }
}
