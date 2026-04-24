import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    .placeholder-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 32px;
      background: radial-gradient(circle at top, #281046 0%, #120822 55%, #0a0416 100%);
    }

    .placeholder-card {
      width: min(680px, 100%);
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(18px);
      border-radius: 24px;
      padding: 36px;
      color: #fff;
    }

    .placeholder-card h1 {
      margin: 0 0 12px;
      font-size: clamp(2rem, 4vw, 3rem);
    }

    .placeholder-card p {
      margin: 0 0 24px;
      color: #ddd7eb;
      line-height: 1.7;
    }

    .placeholder-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .placeholder-actions a {
      border-radius: 999px;
      padding: 12px 20px;
      font-weight: 600;
    }

    .primary-link {
      background: #fbc02d;
      color: #160829;
    }

    .secondary-link {
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
    }
  `],
  template: `
    <section class="placeholder-page">
      <div class="placeholder-card">
        <h1>{{ title }}</h1>
        <p>{{ description }}</p>
        <div class="placeholder-actions">
          <a routerLink="/" class="primary-link">Back home</a>
          <a routerLink="/contact" class="secondary-link">Contact the team</a>
        </div>
      </div>
    </section>
  `
})
export class PlaceholderComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
}
