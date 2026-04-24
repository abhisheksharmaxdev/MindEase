import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  styles: [`
    :host { display: block; }
    .book-page { min-height: 100vh; display: flex; flex-direction: column; background: #120822; color: #fff; }
    .top-header { padding: 30px 40px 10px; }
    .close-btn { width: 45px; height: 45px; border-radius: 50%; border: 1.5px solid #8c52ff; background: transparent; color: #fff; display: grid; place-items: center; text-decoration: none; }
    .form-container { flex: 1; display: flex; justify-content: center; padding: 20px 40px 40px; overflow-y: auto; }
    .form-card { background: #fff; color: #160829; width: min(950px, 100%); border-radius: 24px; padding: 40px 50px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); }
    .card-header { background: #0d0617; color: #fff; text-align: center; padding: 35px 20px; border-radius: 16px; margin-bottom: 40px; }
    .card-header h2 { margin: 0 0 8px; font-size: 24px; }
    .card-header p { margin: 0; font-size: 14px; color: #d1d5db; }
    .input-grid, .checkbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px 40px; }
    .full-width { grid-column: span 2; }
    .input-group { display: flex; flex-direction: column; }
    .input-group label { font-size: 14px; font-weight: 500; margin-bottom: 10px; }
    .input-group input, .input-group select, .input-group textarea { padding: 14px 18px; border: 1.5px solid #160829; border-radius: 8px; font-size: 14px; }
    .phone-group { display: flex; gap: 15px; }
    .phone-group select { width: 100px; }
    .phone-group input { flex: 1; }
    .options-row { display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; margin-bottom: 25px; }
    .option-btn { padding: 12px 30px; border: 1.5px solid #8c52ff; border-radius: 8px; background: transparent; color: #8c52ff; font-weight: 600; cursor: pointer; min-width: 140px; }
    .option-btn.active { background: #8c52ff; color: #fff; }
    .checkbox-grid { gap: 15px 30px; margin-top: 15px; margin-bottom: 30px; }
    .custom-checkbox-btn { display: flex; align-items: center; padding: 14px 18px; border: 1.5px solid #160829; border-radius: 8px; font-size: 13px; font-weight: 500; }
    .custom-checkbox-btn input { margin-right: 15px; accent-color: #8c52ff; }
    .standard-checkbox { display: flex; align-items: center; font-size: 14px; margin-top: 20px; }
    .standard-checkbox input { margin-right: 10px; accent-color: #8c52ff; }
    .standard-checkbox span { color: #fbc02d; font-weight: 500; }
    textarea { resize: vertical; min-height: 100px; }
    .sub-label { font-size: 12px; color: #6b7280; margin-top: 4px; margin-bottom: 10px; display: block; }
    .footer { background: #160a29; padding: 25px 60px; display: flex; justify-content: space-between; align-items: center; }
    .btn { background: #8c52ff; color: #fff; border: none; border-radius: 8px; padding: 12px 35px; font-size: 15px; cursor: pointer; min-width: 130px; }
    .btn[disabled] { opacity: 0.4; cursor: default; }
    .progress-bar { display: flex; align-items: center; }
    .circle { width: 32px; height: 32px; border-radius: 50%; background: #9e9e9e; color: #fff; display: grid; place-items: center; font-weight: bold; }
    .circle.active { background: #fbc02d; color: #120822; }
    .line-group { display: flex; align-items: center; gap: 8px; margin: 0 15px; }
    .line, .dot { background: #9e9e9e; }
    .line { width: 40px; height: 2px; }
    .dot { width: 6px; height: 6px; border-radius: 50%; }
    .line-group.active .line, .line-group.active .dot { background: #fbc02d; }
    @media (max-width: 768px) {
      .input-grid, .checkbox-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .progress-bar { display: none; }
      .form-card { padding: 30px 20px; }
      .footer { padding: 20px; }
    }
  `],
  template: `
    <div class="book-page">
      <div class="top-header"><a class="close-btn" routerLink="/book-appointment">X</a></div>

      <div class="form-container">
        <div class="form-card">
          <div class="card-header">
            <h2>{{ stepContent[currentStep - 1].title }}</h2>
            <p>{{ stepContent[currentStep - 1].subtitle }}</p>
          </div>

          <ng-container [ngSwitch]="currentStep">
            <div class="input-grid" *ngSwitchCase="1">
              <div class="input-group"><label>First name</label><input [(ngModel)]="personalInfo.firstName" name="firstName" type="text"></div>
              <div class="input-group"><label>Last name</label><input [(ngModel)]="personalInfo.lastName" name="lastName" type="text"></div>
              <div class="input-group"><label>Gender</label><input [(ngModel)]="personalInfo.gender" name="gender" type="text"></div>
              <div class="input-group"><label>Date of Birth</label><input [(ngModel)]="personalInfo.dateOfBirth" name="dateOfBirth" type="date"></div>
              <div class="input-group full-width"><label>Email</label><input [(ngModel)]="personalInfo.email" name="email" type="email"></div>
              <div class="input-group full-width">
                <label>Phone Number</label>
                <div class="phone-group"><select><option>+91</option><option>+1</option></select><input [(ngModel)]="personalInfo.phone" name="phone" type="tel"></div>
              </div>
              <div class="input-group full-width"><label>Country</label><select [(ngModel)]="personalInfo.country" name="country"><option>India</option><option>USA</option><option>UK</option></select></div>
              <div class="input-group"><label>State</label><input [(ngModel)]="personalInfo.state" name="state" type="text"></div>
              <div class="input-group"><label>City</label><input [(ngModel)]="personalInfo.city" name="city" type="text"></div>
              <div class="input-group full-width"><label>Occupation</label><input [(ngModel)]="personalInfo.occupation" name="occupation" type="text"></div>
              <div class="standard-checkbox full-width"><input type="checkbox" id="book-terms"><label for="book-terms">Accept our <span>Terms and Policies</span></label></div>
            </div>

            <div *ngSwitchCase="2">
              <div class="input-group">
                <label>Have you been to therapy before?</label>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyPast'] === 'No'" (click)="selectOption('therapyPast', 'No')">No I haven't</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyPast'] === 'Yes'" (click)="selectOption('therapyPast', 'Yes')">Yes, I have</button>
                </div>
              </div>
              <div class="input-group">
                <label>Which mode you want to take therapy?</label>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyMode'] === 'Online'" (click)="selectOption('therapyMode', 'Online')">Online</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyMode'] === 'Offline'" (click)="selectOption('therapyMode', 'Offline')">Offline</button>
                </div>
              </div>
              <label style="font-size:14px;font-weight:500;">What issues would you like to address? (you can select multiple options)</label>
              <div class="checkbox-grid">
                <label class="custom-checkbox-btn" *ngFor="let issue of issues">
                  <input
                    type="checkbox"
                    [checked]="isSelected('issues', issue)"
                    (change)="toggleMultiSelect('issues', issue)">
                  <span>{{ issue }}</span>
                </label>
              </div>
              <div class="input-group">
                <label>What type of therapy are you looking for?</label>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyType'] === 'Family'" (click)="selectOption('therapyType', 'Family')">Family Therapy</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['therapyType'] === 'Individual'" (click)="selectOption('therapyType', 'Individual')">Individual Therapy</button>
                </div>
              </div>
              <div class="input-group full-width"><label>We would love to know more about your concerns. (optional)</label><textarea [(ngModel)]="preferences.concernNotes" name="concernNotes" placeholder="Share your thoughts here..."></textarea></div>
            </div>

            <div *ngSwitchCase="3">
              <div class="input-group">
                <label>In the past 2 weeks, have you tried to harm yourself in any way?</label>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['harm'] === 'No'" (click)="selectOption('harm', 'No')">No, I haven't</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['harm'] === 'Yes'" (click)="selectOption('harm', 'Yes')">Yes, I have</button>
                </div>
              </div>
              <div class="input-group">
                <label>Have you been diagnosed with a clinical mental health condition by a professional?</label>
                <span class="sub-label">(For eg. Bipolar disorder, PTSD, Severe anxiety etc)</span>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['diagnosed'] === 'No'" (click)="selectOption('diagnosed', 'No')">No, I haven't</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['diagnosed'] === 'Yes'" (click)="selectOption('diagnosed', 'Yes')">Yes, I have</button>
                </div>
              </div>
              <label style="font-size:14px;font-weight:500;">Let us know your language preferences.</label>
              <div class="checkbox-grid" style="margin-bottom:20px;">
                <label class="custom-checkbox-btn">
                  <input type="checkbox" [checked]="isSelected('languages', 'English')" (change)="toggleMultiSelect('languages', 'English')">
                  <span>English</span>
                </label>
                <label class="custom-checkbox-btn">
                  <input type="checkbox" [checked]="isSelected('languages', 'Hindi')" (change)="toggleMultiSelect('languages', 'Hindi')">
                  <span>Hindi</span>
                </label>
              </div>
              <div class="input-group">
                <label>Therapist's gender preference</label>
                <select [(ngModel)]="preferences.therapistGenderPreference" name="therapistGenderPreference">
                  <option>No Preference</option>
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div class="input-group">
                <label>Would you like the therapist to be closer to your age?</label>
                <div class="options-row">
                  <button type="button" class="option-btn" [class.active]="selectedOptions['agePref'] === 'No'" (click)="selectOption('agePref', 'No')">NO</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['agePref'] === 'Yes'" (click)="selectOption('agePref', 'Yes')">Yes</button>
                  <button type="button" class="option-btn" [class.active]="selectedOptions['agePref'] === 'No Preference'" (click)="selectOption('agePref', 'No Preference')">No Preference</button>
                </div>
              </div>
            </div>

            <div *ngSwitchCase="4">
              <label style="font-size:14px;font-weight:500;">When is the most convenient time for you? (you can select multiple options)</label>
              <div class="checkbox-grid">
                <label class="custom-checkbox-btn">
                  <input type="checkbox" [checked]="isSelected('preferredDays', 'Weekdays (Mon - Fri)')" (change)="toggleMultiSelect('preferredDays', 'Weekdays (Mon - Fri)')">
                  <span>Weekdays (Mon - Fri)</span>
                </label>
                <label class="custom-checkbox-btn">
                  <input type="checkbox" [checked]="isSelected('preferredDays', 'Weekend (Sat - Sun)')" (change)="toggleMultiSelect('preferredDays', 'Weekend (Sat - Sun)')">
                  <span>Weekend (Sat - Sun)</span>
                </label>
                <label class="custom-checkbox-btn">
                  <input type="checkbox" [checked]="isSelected('preferredDays', 'No Preferences')" (change)="toggleMultiSelect('preferredDays', 'No Preferences')">
                  <span>No Preferences</span>
                </label>
              </div>
              <label style="font-size:14px;font-weight:500;">Therapist's time preference</label>
              <div class="checkbox-grid">
                <label class="custom-checkbox-btn" *ngFor="let slot of slots">
                  <input type="checkbox" [checked]="isSelected('preferredSlots', slot)" (change)="toggleMultiSelect('preferredSlots', slot)">
                  <span>{{ slot }}</span>
                </label>
              </div>
            </div>
          </ng-container>
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
export class BookFormComponent {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);
  readonly totalSteps = 4;
  readonly steps = [1, 2, 3, 4];
  readonly issues = ['Anxiety & Stress', 'Depression & Low Mood', 'Anger Management', 'Relationship & Family Issues', 'Confidence & Self-Esteem', 'Motivation, Procrastination & Habits', 'Trauma Healing', 'Grief & Loss'];
  readonly slots = ['Morning (10am - 12pm)', 'Afternoon (12pm - 5pm)', 'Evening (5pm - 7pm)', 'Night (7 pm onwards)', 'No Preferences'];
  readonly stepContent = [
    { title: 'Let us get to know you.', subtitle: 'This is to ensure we can reach out to you to offer help.' },
    { title: 'Therapy & you.', subtitle: 'These details are important to give appropriate care.' },
    { title: "We want to ensure you're not in a crisis.", subtitle: "Don't worry. There's always someone to help." },
    { title: 'Let us know about your preferences.', subtitle: "We will ensure you're as comfortable as possible." }
  ];
  currentStep = 1;
  selectedOptions: Record<string, string> = {};
  selectedIssues: string[] = [];
  selectedLanguages: string[] = [];
  selectedPreferredDays: string[] = [];
  selectedPreferredSlots: string[] = [];
  personalInfo: any = {};
  preferences: any = { concernNotes: '', therapistGenderPreference: 'No Preference' };

  /**
   * Moves the user through the form and saves the selected answers before the
   * matches page is shown.
   */

  changeStep(direction: number): void {
    if (direction === 1 && this.currentStep === this.totalSteps) {
      this.bookingService.saveDraft({
        personalInfo: this.personalInfo,
        therapyInfo: {
          therapyPast: this.selectedOptions['therapyPast'] || '',
          therapyMode: this.selectedOptions['therapyMode'] || '',
          therapyType: this.selectedOptions['therapyType'] || '',
          concerns: this.selectedIssues
        },
        safetyInfo: {
          harm: this.selectedOptions['harm'] || '',
          diagnosed: this.selectedOptions['diagnosed'] || '',
          agePref: this.selectedOptions['agePref'] || '',
          languages: this.selectedLanguages,
          therapistGenderPreference: this.preferences.therapistGenderPreference || 'No Preference'
        },
        preferences: {
          ...this.preferences,
          preferredDays: this.selectedPreferredDays,
          preferredSlots: this.selectedPreferredSlots
        }
      });
      this.router.navigate(['/matches']);
      return;
    }
    this.currentStep = Math.min(this.totalSteps, Math.max(1, this.currentStep + direction));
  }

  selectOption(group: string, value: string): void {
    this.selectedOptions[group] = value;
  }

  /**
   * Toggles multi-select checkbox groups such as issues and preferred times.
   */
  toggleMultiSelect(group: 'issues' | 'languages' | 'preferredDays' | 'preferredSlots', value: string): void {
    const collectionMap = {
      issues: this.selectedIssues,
      languages: this.selectedLanguages,
      preferredDays: this.selectedPreferredDays,
      preferredSlots: this.selectedPreferredSlots
    };

    const collection = collectionMap[group];
    const index = collection.indexOf(value);

    if (index >= 0) {
      collection.splice(index, 1);
      return;
    }

    collection.push(value);
  }

  /**
   * Checks whether a multi-select value is already chosen in the current draft.
   */
  isSelected(group: 'issues' | 'languages' | 'preferredDays' | 'preferredSlots', value: string): boolean {
    const collectionMap = {
      issues: this.selectedIssues,
      languages: this.selectedLanguages,
      preferredDays: this.selectedPreferredDays,
      preferredSlots: this.selectedPreferredSlots
    };

    return collectionMap[group].includes(value);
  }
}
