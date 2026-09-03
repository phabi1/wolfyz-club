import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FieldType, FormlyModule } from '@ngx-formly/core';

@Component({
  selector: 'app-formly-amount-field',
  imports: [FormlyModule, MatFormFieldModule, MatInputModule],
  templateUrl: './amount-field.html',
  styleUrl: './amount-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AmountFieldType extends FieldType {
  get unitsValue(): string {
    const amount = Math.abs(this.amountInCents);
    return Math.floor(amount / 100).toString();
  }

  get centsValue(): string {
    const amount = Math.abs(this.amountInCents);
    return String(amount % 100).padStart(2, '0');
  }

  get isDisabled(): boolean {
    return this.formControl.disabled || !!this.props.disabled;
  }

  onUnitsInput(value: string): void {
    this.updateAmount(value, this.centsValue);
  }

  onCentsInput(value: string): void {
    this.updateAmount(this.unitsValue, value);
  }

  private get amountInCents(): number {
    const value = this.formControl.value;
    if (typeof value === 'number' && Number.isFinite(value)) {
      return Math.trunc(value);
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return Math.trunc(parsed);
      }
    }

    return 0;
  }

  private updateAmount(unitsRaw: string, centsRaw: string): void {
    const unitsDigits = this.keepDigits(unitsRaw);
    const centsDigits = this.keepDigits(centsRaw).slice(0, 2);

    const units = unitsDigits ? Number(unitsDigits) : 0;
    const cents = centsDigits ? Number(centsDigits) : 0;
    const next = units * 100 + Math.min(cents, 99);

    this.formControl.setValue(next);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }

  private keepDigits(value: string): string {
    return value.replace(/\D+/g, '');
  }
}