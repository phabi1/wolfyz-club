import {
  AfterViewInit,
  Component,
  effect,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { PaymentService } from '../../../../services/billing/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pages-billing-payments-new',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, FormlyModule],
  templateUrl: './new.html',
  styleUrl: './new.css',
})
export class New implements AfterViewInit {
  private dialog: MatDialog = inject(MatDialog);
  private router: Router = inject(Router);
  private paymentService: PaymentService = inject(PaymentService);

  dialogTpl = viewChild<TemplateRef<any>>('dialogTpl');
  processing = signal(false);
  canSave = signal(false);

  form = new FormGroup({});
  model = {
    amount: 0,
    payed_at: new Date(),
    payment_method: '',
    payer_firstname: '',
    payer_lastname: '',
    payer_email: '',
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'amount',
      type: 'input',
      props: {
        label: 'Amount',
        required: true,
      },
    },
    {
      key: 'payed_at',
      type: 'input',
      props: {
        label: 'Payed At',
        required: true,
      },
    },
    {
      key: 'payment_method',
      type: 'select',
      props: {
        label: 'Payment Method',
        required: true,
        options: [
          { label: 'Credit Card', value: 'credit_card' },
          { label: 'Check', value: 'check' },
          { label: 'Bank Transfer', value: 'bank_transfer' },
        ],
      },
    },
    {
      key: 'payer_firstname',
      type: 'input',
      props: {
        label: 'Payer Firstname',
        required: true,
      },
    },
    {
      key: 'payer_lastname',
      type: 'input',
      props: {
        label: 'Payer Lastname',
        required: true,
      },
    },
    {
      key: 'payer_email',
      type: 'input',
      props: {
        label: 'Payer Email',
        required: true,
      },
    },
  ];

  constructor() {
    effect(() => {
      const subscription = this.form.valueChanges.subscribe(() => {
        this.canSave.set(this.form.valid);
      });

      return () => subscription.unsubscribe();
    });
  }

  ngAfterViewInit(): void {
    const dialogTpl = this.dialogTpl();
    if (dialogTpl) {
      this.dialog
        .open(dialogTpl)
        .afterClosed()
        .subscribe(() => {
          this.router.navigate(['/billing/payments']);
        });
    }
  }

  onSave() {
    if (this.form.valid) {
      this.processing.set(true);
      this.paymentService
        .create({
          amount: this.model.amount,
          payed_at: this.model.payed_at,
          payment_method: this.model.payment_method,
          payer_firstname: this.model.payer_firstname,
          payer_lastname: this.model.payer_lastname,
          payer_email: this.model.payer_email,
        })
        .subscribe(() => {
          this.processing.set(false);
        });
    }
  }
}
