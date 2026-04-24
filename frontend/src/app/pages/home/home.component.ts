import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { FooterComponent } from '../../shared/footer/footer.component';

type FaqGroup = 'therapy' | 'process';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FooterComponent],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['../../../styles/home.css'],
  template: `
    <header>
      <nav class="navbar">
        <div class="logo">
          <a routerLink="/">
            <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018041/SIH_image_13_yih65d.png" alt="MindEase Logo">
          </a>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/">Home</a></li>
          <li><a routerLink="/report-concern">Report a Concern</a></li>
          <li><a routerLink="/book-appointment">Book Appointment</a></li>
          <li><a routerLink="/about">About Us</a></li>
          <li><a routerLink="/contact">Contact Us</a></li>
        </ul>
        <div class="dropdown" (mouseenter)="showDropdown()" (mouseleave)="hideDropdownWithDelay()">
          <ng-container *ngIf="!currentUser(); else userMenu">
            <button class="btn-signin dropdown-btn">Sign In</button>
            <div class="dropdown-menu" [class.show]="dropdownVisible" (mouseenter)="showDropdown()">
              <a routerLink="/signup">User</a>
              <a routerLink="/therapist-signup">Therapist Portal</a>
              <a routerLink="/admin-login">Admin Portal</a>
            </div>
          </ng-container>
          <ng-template #userMenu>
            <button class="btn-signin dropdown-btn">{{ (currentUser()?.fullName?.slice(0, 2) || 'ME').toUpperCase() }}</button>
            <div class="dropdown-menu" [class.show]="dropdownVisible" (mouseenter)="showDropdown()">
              <a *ngIf="currentUser()?.role === 'user'" routerLink="/dashboard">Dashboard</a>
              <a *ngIf="currentUser()?.role === 'therapist'" routerLink="/therapist-dashboard">Therapist Dashboard</a>
              <a *ngIf="currentUser()?.role === 'admin'" routerLink="/admin-dashboard">Admin Dashboard</a>
              <a href="#" (click)="$event.preventDefault(); logout()">Logout</a>
            </div>
          </ng-template>
        </div>
      </nav>
    </header>

    <main class="hero">
      <div class="hero-content">
        <h1>Welcome to <br><span class="highlight">{{ rotatingTitle }}</span><br> for Mental Well-being</h1>
        <p>Anxious, stressed, or feeling lost? Whatever troubles your mind, we're here to help. Report a Concern or Chat with <b>MindMate (AI).</b></p>
        <div class="hero-buttons">
          <a class="btn btn-primary" routerLink="/report-concern">Report a Concern</a>
          <a class="btn btn-secondary" routerLink="/mindmate">Chat With MindMate</a>
          <a class="btn btn-primary" routerLink="/book-appointment">Book Appointment</a>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018070/SIH_image_18_erlclx.png" alt="Person using a tablet">
      </div>
    </main>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <p class="subtitle">Find the right therapist in a few clicks. We're here to guide you along the way.</p>
      <div class="how-it-works-container">
        <div class="how-it-works-image">
          <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018058/SIH_image_7_n7hgfv.png" alt="Therapist pointing">
        </div>
        <div class="how-it-works-grid">
          <div class="grid-item" *ngFor="let item of howItWorks">
            <img class="icon-placeholder" [src]="item.icon" alt="Icon">
            <h3 [innerHTML]="item.title"></h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="explore-therapy">
      <div class="explore-therapy-header">
        <div class="left-content">
          <h2>Would you like to <span class="highlight-gold">explore</span> Therapy<span class="highlight-gold">?</span> Report a Concern.</h2>
        </div>
        <div class="right-content">
          <p>Therapy is a great way for you to <span class="emphasize">de-stress or get things off your chest</span> with <span class="emphasize">no judgement.</span></p>
        </div>
      </div>
      <p class="explore-therapy-subheading">We offer Therapy for everyone -</p>
      <div class="therapy-options">
        <div class="therapy-item" *ngFor="let therapy of therapyOptions">
          <img class="therapy-icon" [src]="therapy.icon" [alt]="therapy.title">
          <h3>{{ therapy.title }}</h3>
          <div class="therapy-card">
            <p *ngFor="let line of therapy.items">{{ line }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="testimonials">
      <div class="testimonials-header">
        <div class="testimonials-header-text">
          <h2>Sometimes you're not ready to talk.<br><span class="highlight-gold">That's Okay :)</span></h2>
          <p>What people say about <span class="highlight-gold">MindEase</span></p>
        </div>
        <a routerLink="/reviews" class="btn btn-primary">Read More</a>
      </div>
      <div class="testimonials-grid">
        <div class="testimonial-card" *ngFor="let testimonial of testimonials">
          <div class="quote-icon">"</div><br>
          <p class="card-text">{{ testimonial.text }}</p>
          <p class="author">- {{ testimonial.author }}</p>
        </div>
      </div>
    </section>

    <section class="match-therapist-section">
      <div class="match-therapist-container">
        <div class="match-therapist-content">
          <h2>Therapy with</h2>
          <h2>the <span class="highlight-gold">right therapist</span></h2>
          <div class="match-therapist-buttons">
            <a routerLink="/mindmate" class="btn btn-primary">Chat With MindMate</a>
            <a routerLink="/book-appointment" class="btn btn-outline-yellow">Get to Therapist</a>
          </div>
        </div>
        <div class="match-therapist-image-wrapper">
          <img src="https://res.cloudinary.com/daegs95ds/image/upload/v1776018123/SIH_image_2_radsot.png" alt="A person smiling while working on a laptop">
          <div class="stats-overlay">
            <div class="stat-item">
              <h3>90%</h3>
              <p>Clients match with therapists in one go</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <h3>20+</h3>
              <p>Parameters matched to find you the right expert.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mindmate-spotlight">
      <div class="mindmate-copy">
        <span class="mindmate-badge">New Support Space</span>
        <h2>Meet <span class="highlight-gold">MindMate</span>, your gentle AI check-in buddy.</h2>
        <p>
          Built for students who sometimes just need to talk, breathe, vent, or untangle their thoughts.
          MindMate keeps the conversation simple, warm, and easy to understand.
        </p>
        <div class="mindmate-actions">
          <a routerLink="/mindmate" class="btn btn-primary">Open MindMate</a>
          <a routerLink="/signup" class="btn btn-secondary" *ngIf="!currentUser()">Sign In First</a>
        </div>
      </div>
      <div class="mindmate-preview">
        <div class="preview-window">
          <div class="preview-bubble assistant">You do not have to explain everything perfectly. Start anywhere.</div>
          <div class="preview-bubble user">I feel tired all the time and I think I am falling behind.</div>
          <div class="preview-bubble assistant">That sounds heavy. Let's slow it down together and look at one part of it first.</div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <h2>Clear all the confusion in your mind</h2>
      <p class="subtitle">We have the answers to any questions you may have.</p>
      <div class="faq-container">
        <div class="faq-tabs">
          <div class="faq-tab" [class.active]="activeFaqTab === 'therapy'" (click)="activeFaqTab = 'therapy'">About Therapy</div>
          <div class="faq-tab" [class.active]="activeFaqTab === 'process'" (click)="activeFaqTab = 'process'">About Process</div>
        </div>
        <div class="faq-content-wrapper">
          <div class="faq-content active" *ngIf="activeFaqTab === 'therapy'">
            <div class="faq-accordion">
              <div class="accordion-item" *ngFor="let item of therapyFaqs; let index = index">
                <button class="accordion-header" [class.active]="openAccordionId === 'therapy-' + index" (click)="toggleAccordion('therapy-' + index)">
                  <span>{{ item.question }}</span>
                  <div class="accordion-icon">{{ openAccordionId === 'therapy-' + index ? '-' : '+' }}</div>
                </button>
                <div class="accordion-content" [style.maxHeight]="openAccordionId === 'therapy-' + index ? '240px' : null">
                  <p>{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="faq-content active" *ngIf="activeFaqTab === 'process'">
            <div class="faq-accordion">
              <div class="accordion-item" *ngFor="let item of processFaqs; let index = index">
                <button class="accordion-header" [class.active]="openAccordionId === 'process-' + index" (click)="toggleAccordion('process-' + index)">
                  <span>{{ item.question }}</span>
                  <div class="accordion-icon">{{ openAccordionId === 'process-' + index ? '-' : '+' }}</div>
                </button>
                <div class="accordion-content" [style.maxHeight]="openAccordionId === 'process-' + index ? '220px' : null">
                  <p>{{ item.answer }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-banner-section">
      <div class="contact-banner">
        <div class="banner-text">
          <h3>Still have questions?</h3>
          <p>We're here to talk.</p>
        </div>
        <a routerLink="/contact" class="btn-outline">Contact Us</a>
      </div>
    </section>

    <app-footer></app-footer>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  readonly howItWorks = [
    { icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018029/SIH_image_5_hxhvke.png', title: 'Talk to <b><span class="highlight-gold">MindMate AI</span></b>', description: 'and ease your stress, just like chatting with a friend.' },
    { icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018034/SIH_image_8_smzwtx.png', title: 'Report your Patient', description: 'just provide a few simple details to get started.' },
    { icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018037/SIH_image_10_r5qdxx.png', title: 'Book Appointment', description: 'fill in a simple form to help us understand you better.' },
    { icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018029/SIH_image_6_wioax1.png', title: 'Select your Therapist', description: 'and schedule your session at your convenience.' }
  ];
  readonly therapyOptions = [
    { title: 'Individual Therapy', icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018094/SIH_image_40_gd6gqp.png', items: ['Personal Growth', 'Anxiety & Stress', 'Depression', 'Relationship Issues', 'Grief & Loss'] },
    { title: 'Corporate Services', icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018093/SIH_image_38_yzezn8.png', items: ['Trauma', 'Work-Life Balance', 'Self-Esteem', 'Family Conflict', 'Anger Management'] },
    { title: 'Teen Therapy', icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018097/SIH_image_44_eg1wbi.png', items: ['Addiction', 'Eating Disorders', 'Sleep Issues', 'Parenting', 'LGBTQ+ Support'] },
    { title: 'Student Therapy', icon: 'https://res.cloudinary.com/daegs95ds/image/upload/v1776018097/SIH_image_46_hvvnar.png', items: ['Career Counseling', 'Phobias', 'Social Anxiety', 'ADHD Support', 'Life Transitions'] }
  ];
  readonly testimonials = [
    { text: 'Therapy sessions with Mehek are one of the best things that I love looking forward to. I have had a hard time searching for a therapist who could meet my needs and Mehek is the perfect match for me.', author: 'Anonymous' },
    { text: 'Finding a safe space to be vulnerable was crucial for me. MindEase provided exactly that. My therapist is incredibly empathetic and has guided me through some of my toughest times with great care and professionalism.', author: 'Anonymous' },
    { text: 'The convenience of online sessions combined with the quality of therapists is unmatched. I was skeptical at first, but it has truly changed my perspective on mental health support. I highly recommend it.', author: 'Anonymous' }
  ];
  readonly therapyFaqs = [
    { question: 'What does Therapy mean?', answer: 'Therapy, also called psychotherapy or counseling, is the process of meeting with a therapist to resolve problematic behaviors, beliefs, feelings, relationship issues, and somatic responses.' },
    { question: 'How do I know if I need Therapy?', answer: 'If you are experiencing emotional distress, relationship problems, or difficulty coping with daily life, therapy can help you explore those experiences in a supportive, judgment-free space.' },
    { question: 'Is online therapy effective?', answer: 'Yes. For many people, online therapy can be as effective as in-person sessions while also being more convenient and accessible.' }
  ];
  readonly processFaqs = [
    { question: 'How do I get started?', answer: 'Start by booking an appointment, filling out the short questionnaire, and then reviewing the therapist options that best fit your needs.' },
    { question: 'What is the cost of a session?', answer: 'Session costs vary based on the therapist and service type. The pricing route can be added next if you want the full production flow.' }
  ];
  readonly titleOptions = ['MindEase', 'Your space'];
  activeFaqTab: FaqGroup = 'therapy';
  openAccordionId = 'therapy-0';
  rotatingTitle = this.titleOptions[0];
  dropdownVisible = false;
  private titleTimerId?: number;
  private dropdownTimerId?: number;
  private titleIndex = 0;
  readonly currentUser = this.authService.currentUser;

  ngOnInit(): void {
    this.titleTimerId = window.setInterval(() => {
      this.titleIndex = (this.titleIndex + 1) % this.titleOptions.length;
      this.rotatingTitle = this.titleOptions[this.titleIndex];
    }, 2500);
  }

  ngOnDestroy(): void {
    if (this.titleTimerId) window.clearInterval(this.titleTimerId);
    if (this.dropdownTimerId) window.clearTimeout(this.dropdownTimerId);
  }

  showDropdown(): void {
    if (this.dropdownTimerId) window.clearTimeout(this.dropdownTimerId);
    this.dropdownVisible = true;
  }

  hideDropdownWithDelay(): void {
    this.dropdownTimerId = window.setTimeout(() => {
      this.dropdownVisible = false;
    }, 1500);
  }

  toggleAccordion(id: string): void {
    this.openAccordionId = this.openAccordionId === id ? '' : id;
  }

  logout(): void {
    this.authService.logout();
  }
}
