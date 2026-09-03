import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FieldType, FormlyModule } from '@ngx-formly/core';

type PaymentMethodSetting = {
  id: string;
  title: string;
  type: 'credit_card' | 'credit_card_x' | 'bank_transfer' | 'check' | string;
};

@Component({
  selector: 'app-formly-payment-methods-field',
  imports: [FormlyModule],
  templateUrl: './payment-methods-field.html',
  styleUrl: './payment-methods-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodsFieldType extends FieldType {
  readonly availableTypes = [
    { value: 'credit_card', label: 'Credit card' },
    { value: 'credit_card_x', label: 'Credit card x' },
    { value: 'bank_transfer', label: 'Bank transfer' },
    { value: 'check', label: 'Check' },
  ];

  get items(): PaymentMethodSetting[] {
    const value = this.formControl.value;
    return Array.isArray(value) ? (value as PaymentMethodSetting[]) : [];
  }

  addPaymentMethod(): void {
    this.updateItems([
      ...this.items,
      {
        id: '',
        title: '',
        type: 'credit_card',
      },
    ]);
  }

  removePaymentMethod(index: number): void {
    this.updateItems(this.items.filter((_, i) => i !== index));
  }

  setId(index: number, value: string): void {
    this.patchItem(index, { id: value });
  }

  setTitle(index: number, value: string): void {
    this.patchItem(index, { title: value });
  }

  setType(index: number, value: string): void {
    this.patchItem(index, { type: value });
  }

  private patchItem(index: number, patch: Partial<PaymentMethodSetting>): void {
    const next = [...this.items];
    const current = next[index];
    if (!current) {
      return;
    }

    next[index] = { ...current, ...patch };
    this.updateItems(next);
  }

  private updateItems(items: PaymentMethodSetting[]): void {
    this.formControl.setValue(items);
    this.formControl.markAsDirty();
    this.formControl.markAsTouched();
    this.formControl.updateValueAndValidity();
  }
}
