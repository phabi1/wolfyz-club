import { Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PeriodService } from '../../../../../services/membership/period.service';

@Component({
  selector: 'app-print-period',
  imports: [MatFormFieldModule, MatSelectModule, MatButtonModule],
  templateUrl: './print-period.html',
  styleUrl: './print-period.css',
})
export class PrintPeriod {
  private readonly periodService = inject(PeriodService);
  periods = signal<any[]>([]);

  value = signal<number | null>(null);


  constructor() {
    effect(() => {
      this.periodService.items(2).subscribe(({ items }) => {
        this.periods.set(items.map(item => ({
          value: item.id,
          label: item.title,
        })));
      });
    });
  }

  onPeriodChange(event: any) {
    console.log('Period changed to value:', event.value);
    this.value.set(event.value);
  }

  print() {
    const value = this.value();
    if (value === null) {
      return;
    }

    console.log('Printing period with value:', value);

    this.periodService.print(2, value).subscribe();
  }
}
