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
import { BarController, BarElement, CategoryScale, Chart, LinearScale, Tooltip } from 'chart.js';
import {
  AgeDistribution as AgeDistributionData,
  SubscriptionService,
} from '../../../../../services/membership/subscription.service';
import { formatDate } from '../../../../../utils/date';
import { campaignIdSnapshot } from '../../../../../utils/route';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

// Single series: one hue (validated against the white surface), recessive axes
const BAR_COLOR = '#257de0';
const BAR_HOVER_COLOR = '#1c64b8';
const GRID_COLOR = '#e7e7e7';
const TICK_COLOR = '#64748b';

type AgeBar = { age: number; count: number };

@Component({
  selector: 'app-age-distribution',
  imports: [],
  templateUrl: './age-distribution.html',
  styleUrls: ['./age-distribution.css'],
})
export class AgeDistribution {
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly campaignId = campaignIdSnapshot(inject(ActivatedRoute));
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private chart: Chart<'bar'> | null = null;

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly data = signal<AgeDistributionData | null>(null);

  /** One bar per year between the youngest and the oldest, gaps filled with 0 */
  readonly bars = computed<AgeBar[]>(() => {
    const ages = Object.entries(this.data()?.ages ?? {})
      .map(([age, count]) => ({ age: +age, count: +count }))
      .filter((bar) => Number.isFinite(bar.age) && bar.count > 0);
    if (!ages.length) {
      return [];
    }
    const byAge = new Map(ages.map((bar) => [bar.age, bar.count]));
    const min = Math.min(...byAge.keys());
    const max = Math.max(...byAge.keys());
    return Array.from({ length: max - min + 1 }, (_, i) => ({
      age: min + i,
      count: byAge.get(min + i) ?? 0,
    }));
  });

  readonly total = computed(() => this.bars().reduce((sum, bar) => sum + bar.count, 0));
  readonly unknown = computed(() => this.data()?.unknown ?? 0);
  readonly referenceDate = computed(() => {
    const value = this.data()?.reference_date;
    return value ? formatDate(value) : '';
  });

  readonly median = computed<number | null>(() => {
    const total = this.total();
    if (!total) {
      return null;
    }
    const middle = Math.ceil(total / 2);
    let seen = 0;
    for (const bar of this.bars()) {
      seen += bar.count;
      if (seen >= middle) {
        return bar.age;
      }
    }
    return null;
  });

  readonly minors = computed(() =>
    this.bars()
      .filter((bar) => bar.age < 18)
      .reduce((sum, bar) => sum + bar.count, 0),
  );

  /** Only non-empty ages, for the accessible table */
  readonly rows = computed(() => this.bars().filter((bar) => bar.count > 0));

  constructor() {
    if (this.campaignId) {
      this.subscriptionService.countByAge(this.campaignId).subscribe({
        next: (data) => {
          this.data.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set(true);
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }

    effect(() => {
      const canvas = this.canvas()?.nativeElement;
      const bars = this.bars();

      if (this.chart && this.chart.canvas !== canvas) {
        this.chart.destroy();
        this.chart = null;
      }
      if (!canvas || !bars.length) {
        return;
      }

      const data = {
        labels: bars.map((bar) => String(bar.age)),
        datasets: [
          {
            data: bars.map((bar) => bar.count),
            backgroundColor: BAR_COLOR,
            hoverBackgroundColor: BAR_HOVER_COLOR,
            // Rounded data-end, square at the baseline
            borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
            borderSkipped: false as const,
            maxBarThickness: 24,
            barPercentage: 0.85,
            categoryPercentage: 1,
          },
        ],
      };

      if (this.chart) {
        this.chart.data = data;
        this.chart.update();
        return;
      }

      this.chart = new Chart(canvas, {
        type: 'bar',
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 300 },
          // Hover anywhere in the age column, not only on the bar itself
          interaction: { mode: 'index', intersect: false },
          scales: {
            x: {
              title: { display: true, text: 'Âge (ans)', color: TICK_COLOR },
              grid: { display: false },
              border: { color: GRID_COLOR },
              ticks: { color: TICK_COLOR, autoSkip: true, maxRotation: 0 },
            },
            y: {
              beginAtZero: true,
              grid: { color: GRID_COLOR },
              border: { display: false },
              ticks: { color: TICK_COLOR, precision: 0 },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              callbacks: {
                title: (items) => `${items[0]?.label} ans`,
                label: (ctx) => {
                  const value = ctx.parsed.y ?? 0;
                  const percent = this.total() ? Math.round((value / this.total()) * 100) : 0;
                  return `${value} adhérent${value > 1 ? 's' : ''} (${percent} %)`;
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
