import {
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArcElement, Chart, Legend, PieController, Tooltip } from 'chart.js';
import { SubscriptionService } from '../../../../../services/membership/subscription.service';
import { campaignIdSnapshot } from '../../../../../utils/route';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const GENDERS: { key: string; label: string; color: string }[] = [
  {
    key: 'male',
    label: $localize`:@@membership.subscriptions.member.gender.male:Male`,
    color: '#0891b2',
  },
  {
    key: 'female',
    label: $localize`:@@membership.subscriptions.member.gender.female:Female`,
    color: '#f9a8d4',
  },
  {
    key: 'other',
    label: $localize`:@@membership.subscriptions.member.gender.other:Other`,
    color: '#94a3b8',
  },
];

@Component({
  selector: 'app-gender-distribution',
  imports: [],
  templateUrl: './gender-distribution.html',
  styleUrls: ['./gender-distribution.css'],
})
export class GenderDistribution {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly campaignId = campaignIdSnapshot(inject(ActivatedRoute));
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart<'pie'> | null = null;

  readonly loading = signal(true);
  readonly counts = signal<Record<string, number>>({});
  readonly total = computed(() =>
    Object.values(this.counts()).reduce((sum, value) => sum + (value ?? 0), 0),
  );

  constructor() {
    this.subscriptionService.countByGender(this.campaignId).subscribe({
      next: (counts) => {
        this.counts.set(counts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      const counts = this.counts();

      if (this.chart && this.chart.canvas !== canvas) {
        this.chart.destroy();
        this.chart = null;
      }
      if (!canvas || this.total() === 0) {
        return;
      }

      // "other" is only displayed when at least one member has this gender
      const genders = GENDERS.filter((g) => g.key !== 'other' || (counts[g.key] ?? 0) > 0);
      const data = {
        labels: genders.map((g) => g.label),
        datasets: [
          {
            data: genders.map((g) => counts[g.key] ?? 0),
            backgroundColor: genders.map((g) => g.color),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        ],
      };

      if (this.chart) {
        this.chart.data = data;
        this.chart.update();
        return;
      }

      this.chart = new Chart(canvas, {
        type: 'pie',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const value = ctx.parsed;
                  const percent = Math.round((value / this.total()) * 100);
                  return ` ${ctx.label}: ${value} (${percent}%)`;
                },
              },
            },
          },
        },
      });
    });

    inject(DestroyRef).onDestroy(() => this.chart?.destroy());
  }
}
