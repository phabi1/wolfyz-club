import { Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import type { RequestPay as RequestPayModel } from "../../../../../models/membership/request-pay";
import { AmountPipe } from "../../../../../pipes/amount-pipe";
import { GhostingLine } from "../../../../ui/ghosting/line/line";

@Component({
  selector: 'app-membership-request-details-request-pay',
  imports: [AmountPipe, GhostingLine, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './request-pay.html',
  styleUrl: './request-pay.css',
})
export class RequestPay {
  readonly pay = input.required<RequestPayModel>();
  readonly calculating = input<boolean>(true);
  readonly totalAmount = computed(() => this.pay().total_amount || 0);

  value = signal<string>('');

  readonly discountChange = output<number>();

  onValueChange(newValue: string) {
    this.value.set(newValue);
  }

  applyDiscount() {
    console.log(this.value());
    this.discountChange.emit(Number(this.value()));
  }
}
