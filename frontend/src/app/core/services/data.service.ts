import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { API_BASE_URL } from './api.config';
import { DEFAULT_THERAPISTS, findDefaultTherapist } from '../data/default-therapists';

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly http = inject(HttpClient);

  /**
   * Loads the three fixed therapists used by the booking and matches flow.
   */
  getTherapists() {
    return this.http.get<{ therapists: any[] }>(`${API_BASE_URL}/therapists`).pipe(
      map(({ therapists }) => ({ therapists: therapists?.length ? therapists : DEFAULT_THERAPISTS })),
      catchError(() => of({ therapists: DEFAULT_THERAPISTS }))
    );
  }

  getTherapist(id: string) {
    return this.http.get<{ therapist: any }>(`${API_BASE_URL}/therapists/${id}`).pipe(
      map(({ therapist }) => ({ therapist: therapist || findDefaultTherapist(id) })),
      catchError(() => {
        const therapist = findDefaultTherapist(id);
        return therapist
          ? of({ therapist })
          : throwError(() => new Error('Therapist not found.'));
      })
    );
  }

  createConcern(payload: any) {
    return this.http.post(`${API_BASE_URL}/concerns`, payload);
  }

  createAppointment(payload: any) {
    return this.http.post<{ message: string; appointment: any }>(`${API_BASE_URL}/appointments`, payload);
  }

  getMyAppointments() {
    return this.http.get<{ appointments: any[] }>(`${API_BASE_URL}/appointments/mine`);
  }

  getTherapistDashboard() {
    return this.http.get<any>(`${API_BASE_URL}/therapists/dashboard`);
  }

  decideAppointment(id: string, payload: any) {
    return this.http.post(`${API_BASE_URL}/therapists/appointments/${id}/decision`, payload);
  }

  decideConcern(id: string, payload: any) {
    return this.http.post(`${API_BASE_URL}/therapists/concerns/${id}/decision`, payload);
  }

  /**
   * Keeps the admin dashboard focused on concern assignment only.
   */
  getAdminDashboard() {
    return this.http.get<any>(`${API_BASE_URL}/admin/dashboard`);
  }

  assignConcern(id: string, therapistId: string) {
    return this.http.post(`${API_BASE_URL}/admin/concerns/${id}/assign`, { therapistId });
  }

  reviewTherapist(id: string, payload: { action: 'approve' | 'reject'; adminNotes?: string }) {
    return this.http.post(`${API_BASE_URL}/admin/therapists/${id}/review`, payload);
  }

  getReviews() {
    return this.http.get<{ reviews: any[] }>(`${API_BASE_URL}/reviews`);
  }

  createReview(payload: any) {
    return this.http.post(`${API_BASE_URL}/reviews`, payload);
  }

  chatWithMindmate(messages: Array<{ role: string; content: string }>) {
    return this.http.post<{ reply: string }>(`${API_BASE_URL}/mindmate/chat`, { messages });
  }
}
