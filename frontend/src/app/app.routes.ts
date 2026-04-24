import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AboutComponent } from './pages/about/about.component';
import { AdminAuthComponent } from './pages/admin-auth/admin-auth.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AuthComponent } from './pages/auth/auth.component';
import { BookFormComponent } from './pages/book-form/book-form.component';
import { BookIntroComponent } from './pages/book-intro/book-intro.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HomeComponent } from './pages/home/home.component';
import { MatchesComponent } from './pages/matches/matches.component';
import { MindmateComponent } from './pages/mindmate/mindmate.component';
import { ReportFormComponent } from './pages/report-form/report-form.component';
import { ReportIntroComponent } from './pages/report-intro/report-intro.component';
import { ReviewsComponent } from './pages/reviews/reviews.component';
import { TherapistDashboardComponent } from './pages/therapist-dashboard/therapist-dashboard.component';
import { TherapistAuthComponent } from './pages/therapist-auth/therapist-auth.component';
import { TherapistProfileComponent } from './pages/therapist-profile/therapist-profile.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { PlaceholderComponent } from './pages/placeholder/placeholder.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'MindEase' },
  { path: 'about', component: AboutComponent, title: 'About Us - MindEase' },
  { path: 'contact', component: ContactComponent, title: 'Contact Us - MindEase' },
  { path: 'report-concern', component: ReportIntroComponent, title: 'Report a Concern - MindEase' },
  { path: 'report-form', component: ReportFormComponent, title: 'Friend Welfare Report - MindEase' },
  { path: 'book-appointment', component: BookIntroComponent, title: 'Book Appointment - MindEase' },
  { path: 'book-form', component: BookFormComponent, title: 'Book an Appointment - MindEase' },
  { path: 'signup', component: AuthComponent, title: 'MindEase Sign In / Sign Up' },
  { path: 'admin-login', component: AdminAuthComponent, title: 'MindEase Admin Login' },
  { path: 'therapist-signup', component: TherapistAuthComponent, title: 'MindEase Therapist Login' },
  { path: 'matches', component: MatchesComponent, title: 'Matches - MindEase' },
  { path: 'therapists/:id', component: TherapistProfileComponent, title: 'Therapist Profile - MindEase' },
  { path: 'admin-dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard - MindEase', canActivate: [authGuard, roleGuard(['admin'])] },
  { path: 'dashboard', component: UserDashboardComponent, title: 'User Dashboard - MindEase', canActivate: [authGuard, roleGuard(['user'])] },
  { path: 'therapist-dashboard', component: TherapistDashboardComponent, title: 'Therapist Dashboard - MindEase', canActivate: [authGuard, roleGuard(['therapist'])] },
  { path: 'reviews', component: ReviewsComponent, title: 'Reviews - MindEase' },
  { path: 'mindmate', component: MindmateComponent, title: 'MindMate - MindEase', canActivate: [authGuard, roleGuard(['user'])] },
  {
    path: 'privacy-policy',
    component: PlaceholderComponent,
    title: 'Privacy Policy - MindEase',
    data: { title: 'Privacy policy', description: 'The policy route is available. If you want, I can migrate the full policy copy into Angular in the next pass.' }
  },
  {
    path: 'terms-and-conditions',
    component: PlaceholderComponent,
    title: 'Terms and Conditions - MindEase',
    data: { title: 'Terms and conditions', description: 'This Angular route is in place so the long-form terms content can be ported without changing navigation again.' }
  },
  {
    path: 'disclaimer-policy',
    component: PlaceholderComponent,
    title: 'Disclaimer Policy - MindEase',
    data: { title: 'Disclaimer policy', description: 'This page is wired into the Angular router and ready for the final content migration.' }
  },
  { path: '**', redirectTo: '' }
];
