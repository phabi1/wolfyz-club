import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import { PeriodService } from '../../../../../services/membership/period.service';

type PeriodFormModel = {
  title: string;
  start_date: string;
  end_date: string;
};

@Component({
  selector: 'app-pages-membership-campaign-periods-new',
  imports: [MatDialogModule, MatButtonModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './new.html',
  styleUrl: './new.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly periodService = inject(PeriodService);
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
  model: PeriodFormModel = this.defaultModel();

  ngAfterViewInit(): void {
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

    const campaignId = this.getCampaignId();
    if (!campaignId) {
      return;
    }

    const startDate = new Date(this.model.start_date);
    const endDate = new Date(this.model.end_date);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    const created = await firstValueFrom(
      this.periodService.create(campaignId, {
        title: this.model.title.trim(),
        start_date: startDate,
        end_date: endDate,
      }),
    );

    if (!created?.id) {
      return;
    }

    this.dialogRef?.close('submitted');
    await this.router.navigate(['../', created.id], { relativeTo: this.route });
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

  private getCampaignId(): number {
    const chain = [...this.route.snapshot.pathFromRoot].reverse();
    for (const snapshot of chain) {
      const raw = snapshot.paramMap.get('campaignId');
      if (raw) {
        return +raw;
      }
    }

    return 0;
  }

  private defaultModel(): PeriodFormModel {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 30);

    return {
      title: 'Nouvelle periode',
      start_date: this.toDateInputValue(start),
      end_date: this.toDateInputValue(end),
    };
  }

  private toDateInputValue(value: Date): string {
    const year = value.getFullYear();
    const month = `${value.getMonth() + 1}`.padStart(2, '0');
    const day = `${value.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
