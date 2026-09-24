import { Component, computed } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Base } from '../base';

type NumberRangeFilterValue = {
  min?: number | string;
  max?: number | string;
};

@Component({
  selector: 'app-ui-datagrid-filters-filter-number',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './number.html',
  styleUrls: ['./number.css'],
})
export class NumberFilter extends Base {
  readonly parsedMin = computed<string>(() => {
    const rawValue = this.value();
    if (typeof rawValue === 'object' && rawValue !== null) {
      const min = rawValue.min;
      return min !== undefined && min !== null ? String(min) : '';
    }
    return '';
  });

  readonly parsedMax = computed<string>(() => {
    const rawValue = this.value();
    if (typeof rawValue === 'object' && rawValue !== null) {
      const max = rawValue.max;
      return max !== undefined && max !== null ? String(max) : '';
    }
    return '';
  });

  onMinChange(value: string) {
    const current = this.normalizedRange();
    this.valueChange.emit({ ...current, min: this.parseNumber(value) });
  }

  onMaxChange(value: string) {
    const current = this.normalizedRange();
    this.valueChange.emit({ ...current, max: this.parseNumber(value) });
  }

  private normalizedRange(): NumberRangeFilterValue {
    const current = this.value();

    if (typeof current === 'object' && current !== null) {
      return {
        min: current.min ?? '',
        max: current.max ?? '',
      };
    }

    return { min: '', max: '' };
  }

  private parseNumber(value: string): number | '' {
    if (value.trim() === '') {
      return '';
    }

    const parsed = Number(value);
    return Number.isNaN(parsed) ? '' : parsed;
  }
}
