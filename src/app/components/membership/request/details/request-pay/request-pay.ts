import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import type { RequestPay as RequestPayModel } from "../../../../../models/membership/request-pay";
import { AmountPipe } from "../../../../../pipes/amount-pipe";
import { GhostingLine } from "../../../../ui/ghosting/line/line";

@Component({
  selector: 'app-membership-request-details-request-pay',
  imports: [AmountPipe, GhostingLine, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './request-pay.html',
  styleUrl: './request-pay.css',
})
export class RequestPay {
  private readonly snackBar = inject(MatSnackBar);

  readonly status = input.required<string>();
  readonly pay = input.required<RequestPayModel>();
  readonly calculating = input<boolean>(true);
  readonly sendingInvoiceEmail = input<boolean>(false);
  readonly invoiceEmailSent = input<boolean>(false);
  readonly totalAmount = computed(() => this.pay().total_amount || 0);
  readonly enterAmountLabel = $localize`:@@membership.requests.pay.enterAmount:Enter amount`;
  readonly applyLabel = $localize`:@@membership.requests.pay.apply:Apply`;
  readonly sendInvoiceEmailLabel = $localize`:@@membership.requests.pay.sendInvoiceEmail:Send invoice by email`;
  readonly sendingInvoiceEmailLabel = $localize`:@@membership.requests.pay.sendingInvoiceEmail:Sending...`;
  readonly invoiceEmailSentLabel = $localize`:@@membership.requests.pay.invoiceEmailSent:Invoice email sent.`;
  readonly invoiceEmailFailedLabel = $localize`:@@membership.requests.pay.invoiceEmailFailed:Unable to send invoice email.`;
  readonly closeLabel = $localize`:@@common.button.close:Close`;

  value = signal<string>('');
  private readonly emailSendRequested = signal(false);

  readonly discountChange = output<number>();
  readonly sendInvoiceEmail = output<void>();

  constructor() {
    effect(() => {
      if (!this.emailSendRequested()) {
        return;
      }

      if (this.sendingInvoiceEmail()) {
        return;
      }

      if (this.invoiceEmailSent()) {
        this.snackBar.open(this.invoiceEmailSentLabel, this.closeLabel, {
          duration: 3000,
        });
      } else {
        this.snackBar.open(this.invoiceEmailFailedLabel, this.closeLabel, {
          duration: 5000,
        });
      }

      this.emailSendRequested.set(false);
    });
  }

  onValueChange(newValue: string) {
    this.value.set(newValue);
  }

  applyDiscount() {
    this.discountChange.emit(Number(this.value()));
  }

  onSendInvoiceEmail() {
    this.emailSendRequested.set(true);
    this.sendInvoiceEmail.emit();
  }
}
