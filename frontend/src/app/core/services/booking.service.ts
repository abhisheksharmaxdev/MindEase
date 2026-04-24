import { Injectable } from '@angular/core';

export interface BookingDraft {
  personalInfo: Record<string, unknown>;
  therapyInfo: Record<string, unknown>;
  safetyInfo: Record<string, unknown>;
  preferences: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly key = 'mindease-booking-draft';

  /**
   * Persists the in-progress booking form so later pages can reuse the data.
   */
  saveDraft(draft: BookingDraft) {
    localStorage.setItem(this.key, JSON.stringify(draft));
  }

  /**
   * Reads the latest draft for the matches and payment flow.
   */
  getDraft(): BookingDraft | null {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as BookingDraft) : null;
  }

  /**
   * Clears the saved draft once the appointment request is created.
   */
  clearDraft() {
    localStorage.removeItem(this.key);
  }
}
