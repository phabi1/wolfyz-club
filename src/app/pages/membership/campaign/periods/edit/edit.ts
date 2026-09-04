import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Dispatcher } from '@ngrx/signals/events';
import { firstValueFrom } from 'rxjs';
import { PeriodService } from '../../../../../services/membership/period.service';
import { membershipPeriodDetailsEvents } from '../../../../../stores/membership/periods/details';

type PeriodFormModel = {
  title: string;
  start_date: string;
  end_date: string;
};

@Component({
  selector: 'app-pages-membership-campaign-periods-edit',
  imports: [MatDialogModule, MatButtonModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly periodService = inject(PeriodService);
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly formTpl = viewChild.required<TemplateRef<unknown>>('formTpl');
  private dialogRef: MatDialogRef<unknown> | null = null;

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      props: { label: 'Titre', required: true, maxLength: 255 },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'start_date',
      type: 'input',
      props: { label: 'Date de debut', type: 'date', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'end_date',
      type: 'input',
      props: { label: 'Date de fin', type: 'date', required: true },
      validators: { validation: [Validators.required] },
    },
  ];

  model: PeriodFormModel = {
    title: '',
    start_date: '',
    end_date: '',
  };

  async ngAfterViewInit(): Promise<void> {
    await this.prefillModel();
    this.openDialog();
  }

  onCancel(): void {
    this.dialogRef?.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const campaignId = this.getParamAsNumber('campaignId');
    const periodId = this.getParamAsNumber('periodId');

    if (!campaignId || !periodId) {
      return;
    }

    const startDate = new Date(this.model.start_date);
    const endDate = new Date(this.model.end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    const updated = await firstValueFrom(
      this.periodService.update(campaignId, periodId, {
        title: this.model.title.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );

    if (!updated?.id) {
      return;
    }

    this.dispatcher.dispatch(membershipPeriodDetailsEvents.load({ id: periodId }));
    this.dialogRef?.close('submitted');
    await this.router.navigate(['../'], { relativeTo: this.route });
  }

  private openDialog(): void {
    this.dialogRef = this.dialog.open(this.formTpl(), {
      width: '38rem',
      maxWidth: '96vw',
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result === 'submitted') {
        return;
      }

      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }

  private async prefillModel(): Promise<void> {
    const campaignId = this.getParamAsNumber('campaignId');
    const periodId = this.getParamAsNumber('periodId');

    if (!campaignId || !periodId) {
      return;
    }

    const period = await firstValueFrom(this.periodService.item(campaignId, periodId));
    if (!period?.id) {
      return;
    }

    this.model = {
      title: period.title || '',
      start_date: this.toDateInputValue(period.start_date),
      end_date: this.toDateInputValue(period.end_date),
    };
  }

  private getParamAsNumber(name: string): number {
    const snapshots = [...this.route.snapshot.pathFromRoot].reverse();
    for (const snapshot of snapshots) {
      const raw = snapshot.paramMap.get(name);
      if (raw) {
        return +raw;
      }
    }

    return 0;
  }

  private toDateInputValue(value: Date | string | number): string {
    const date = this.toDate(value);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private toDate(value: Date | string | number): Date {
    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'number') {
      return new Date(value < 1_000_000_000_000 ? value * 1000 : value);
    }

    const numeric = Number(value);
    if (!Number.isNaN(numeric)) {
      return new Date(numeric < 1_000_000_000_000 ? numeric * 1000 : numeric);
    }

    return new Date(value);
  }
}
