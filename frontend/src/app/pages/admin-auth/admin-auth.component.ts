import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    :host { display:block; }
    .page { min-height:100vh; display:grid; place-items:center; padding:32px 20px; background:#120822; }
    .card { width:min(960px,100%); display:grid; grid-template-columns:1.05fr 0.95fr; background:#fff; border-radius:28px; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.35); }
    .form-side { padding:56px 52px; color:#160829; }
    .art-side { background:#0d0617; color:#fff; padding:56px 40px; display:flex; flex-direction:column; justify-content:center; }
    h1 { margin:0 0 12px; color:#8c52ff; font-size:32px; }
    p { margin:0 0 24px; }
    .group { display:grid; gap:10px; margin-bottom:18px; }
    input { width:100%; padding:16px 20px; border:1.5px solid #8c52ff; border-radius:30px; font-size:14px; }
    button { border:none; border-radius:30px; padding:16px 40px; background:#8c52ff; color:#fff; font-weight:600; cursor:pointer; min-width:180px; }
    .hint { margin-top:18px; padding:14px 16px; border-radius:16px; background:#f6f2ff; color:#4b2d86; }
    .message { margin-top:18px; color:#c2410c; }
    .logo { width:160px; margin-bottom:24px; }
    .credential { margin-top:20px; padding:16px; border-radius:18px; background:rgba(255,255,255,0.06); }
    .credential strong { color:#fbc02d; }
    @media (max-width: 860px) {
      .card { grid-template-columns:1fr; }
      .form-side, .art-side { padding:40px 28px; }
    }
  `],
  template: `
    <div class="page">
      <div class="card">
        <section class="form-side">
          <h1>MindEase Admin Portal</h1>
          <p>Sign in to review reported concerns, monitor bookings, and assign the right default therapist.</p>
          <form (ngSubmit)="login()">
            <div class="group">
              <label>Email</label>
              <input [(ngModel)]="loginForm.email" name="email" type="email" placeholder="admin@mindease.com" required>
            </div>
            <div class="group">
              <label>Password</label>
              <input [(ngModel)]="loginForm.password" name="password" type="password" placeholder="Enter admin password" required>
            </div>
            <button type="submit">Log In</button>
          </form>
          <div class="hint">
            Use the admin portal to assign reported concerns to Niharika, Arjun, or Priya and review live booking activity.
          </div>
          <p *ngIf="message" class="message">{{ message }}</p>
        </section>

        <aside class="art-side">
          <img class="logo" src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo">
          <h2 style="margin:0 0 10px;color:#fbc02d;">Admin access restored</h2>
          <p style="color:#d1d5db;">This login is separate so admins can directly reach the dashboard without using user or therapist flows.</p>
          <div class="credential">
            <div><strong>Default Admin Email:</strong> admin@mindease.com</div>
            <div style="margin-top:8px;"><strong>Default Password:</strong> Admin@123</div>
          </div>
        </aside>
      </div>
    </div>
  `
})
export class AdminAuthComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm = {
    email: 'admin@mindease.com',
    password: 'Admin@123'
  };
  message = '';

  /**
   * Converts backend and network failures into a readable admin auth error.
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

  /**
   * Signs in the seeded admin account and opens the admin dashboard.
   */
  login(): void {
    this.authService.login(this.loginForm).subscribe({
      next: ({ user }) => {
        if (user.role !== 'admin') {
          this.message = 'This account does not have admin access.';
          return;
        }

        this.router.navigate(['/admin-dashboard']);
      },
      error: (error) => {
        this.message = this.getAuthErrorMessage(error, 'Unable to sign in.');
      }
    });
  }
}
