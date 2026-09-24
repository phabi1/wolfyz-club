import { Component, computed } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Base } from '../base';

type DateRangeFilterValue = {
  from?: string;
  to?: string;
};

@Component({
  selector: 'app-ui-datagrid-filters-filter-date',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './date.html',
  styleUrls: ['./date.css'],
})
export class DateFilter extends Base {
  readonly parsedFrom = computed<Date | null>(() => {
    const rawValue = this.value();

    if (rawValue instanceof Date) {
      return rawValue;
    }

    if (typeof rawValue === 'object' && rawValue !== null && typeof rawValue.from === 'string') {
      return this.parseDateString(rawValue.from);
    }

    if (typeof rawValue === 'string' && rawValue.length > 0) {
      return this.parseDateString(rawValue);
    }

    return null;
  });

  readonly parsedTo = computed<Date | null>(() => {
    const rawValue = this.value();

    if (rawValue instanceof Date) {
      return rawValue;
    }

    if (typeof rawValue === 'object' && rawValue !== null && typeof rawValue.to === 'string') {
      return this.parseDateString(rawValue.to);
    }

    return null;
  });

  onFromChange(value: Date | null) {
    const current = this.normalizedRange();
    this.valueChange.emit({ ...current, from: this.formatDate(value) });
  }

  onToChange(value: Date | null) {
    const current = this.normalizedRange();
    this.valueChange.emit({ ...current, to: this.formatDate(value) });
  }

  private normalizedRange(): DateRangeFilterValue {
    const current = this.value();

    if (typeof current === 'object' && current !== null) {
      return {
        from: typeof current.from === 'string' ? current.from : '',
        to: typeof current.to === 'string' ? current.to : '',
      };
    }

    return { from: '', to: '' };
  }

  private parseDateString(value: string): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private formatDate(value: Date | null): string {
    if (!value) {
      return '';
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
