import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';

type LicenseSetting = {
  title: string;
  amount: number;
  year_min: number | null;
  year_max: number | null;
};

@Component({
  selector: 'app-formly-licenses-field',
  imports: [FormlyModule],
  templateUrl: './licenses-field.html',
  styleUrl: './licenses-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicensesFieldType extends FieldType {
  get items(): LicenseSetting[] {
    const value = this.formControl.value;
    return Array.isArray(value) ? (value as LicenseSetting[]) : [];
  }

  addLicense(): void {
    this.updateItems([
      ...this.items,
      {
        title: '',
        amount: 0,
        year_min: null,
        year_max: null,
      },
    ]);
  }

  removeLicense(index: number): void {
    this.updateItems(this.items.filter((_, i) => i !== index));
  }

  setTitle(index: number, value: string): void {
    this.patchItem(index, { title: value });
  }

  setAmount(index: number, value: string): void {
    const parsed = Number(value);
    this.patchItem(index, { amount: Number.isNaN(parsed) ? 0 : parsed });
  }

  setYearMin(index: number, value: string): void {
    this.patchItem(index, { year_min: this.toNullableNumber(value) });
  }

  setYearMax(index: number, value: string): void {
    this.patchItem(index, { year_max: this.toNullableNumber(value) });
  }

  private patchItem(index: number, patch: Partial<LicenseSetting>): void {
    const next = [...this.items];
    const current = next[index];
    if (!current) {
      return;
    }

    next[index] = { ...current, ...patch };
    this.updateItems(next);
  }

  private updateItems(items: LicenseSetting[]): void {
    this.formControl.setValue(items);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }

  private toNullableNumber(value: string): number | null {
    const raw = value.trim();
    if (!raw) {
      return null;
    }

    const parsed = Number(raw);
    return Number.isNaN(parsed) ? null : parsed;
  }
}
