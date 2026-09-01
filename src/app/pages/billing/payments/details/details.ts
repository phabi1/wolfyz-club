import { Component, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { distinctUntilChanged, startWith } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Payment } from '../../../../models/billing/payment';
import { PaymentService } from '../../../../services/billing/payment.service';

@Component({
  selector: 'app-pages-billing-payments-details',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  private dialog: MatDialog = inject(MatDialog);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private paymentService: PaymentService = inject(PaymentService);

  dialogTpl = viewChild<TemplateRef<any>>('dialogTpl');
  loading = signal(false);
  item = signal<Payment | null>(null);

  constructor() {
    effect(() => {
      const subscription = this.route.params
        .pipe(
          startWith(this.route.snapshot.params),
          map((params) => params['id']),
          distinctUntilChanged(),
        )
        .subscribe((id) => {
          this.fetchDetails(id);
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

  private fetchDetails(id: string): void {
    this.loading.set(true);
    this.paymentService.item(id).subscribe((payment: Payment) => {
      this.item.set(payment);
      this.loading.set(false);
    });
  }
}
