import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  inject,
  viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import { LessonService } from '../../../../../services/membership/lesson.service';
import { membershipLessonDetailsEvents } from '../../../../../stores/membership/lessons/details';
import { formatDay } from '../../../../../utils/date';

type LessonFormModel = {
  title: string;
  day: number;
  lesson_start: string;
  lesson_end: string;
  age_min: number;
  age_max: number;
  participant_max: number;
};

@Component({
  selector: 'app-pages-membership-campaign-lessons-edit',
  imports: [MatDialogModule, MatButtonModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrls: ['./edit.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly lessonService = inject(LessonService);
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
      key: 'day',
      type: 'select',
      props: {
        label: 'Jour',
        required: true,
        options: Array.from({ length: 7 }, (_, i) => ({ label: formatDay(i), value: i })),
      },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'lesson_start',
      type: 'input',
      props: { label: 'Date de debut', type: 'date', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'lesson_end',
      type: 'input',
      props: { label: 'Date de fin', type: 'date', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'age_min',
      type: 'input',
      props: { label: 'Âge minimum', type: 'number', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'age_max',
      type: 'input',
      props: { label: 'Âge maximum', type: 'number', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'participant_max',
      type: 'input',
      props: { label: 'Nombre de participants', type: 'number', required: true },
      validators: { validation: [Validators.required] },
    },
  ];

  model: LessonFormModel = {
    title: '',
    day: 0,
    lesson_start: '',
    lesson_end: '',
    age_min: 0,
    age_max: 0,
    participant_max: 0,
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
    const lessonId = this.getParamAsNumber('lessonId');

    if (!campaignId || !lessonId) {
      return;
    }

    const startDate = new Date(this.model.lesson_start);
    const endDate = new Date(this.model.lesson_end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return;
    }

    const updated = await firstValueFrom(
      this.lessonService.update(campaignId, lessonId, {
        title: this.model.title.trim(),
        day: new Date(this.model.lesson_start).getDay(),
        lesson_start: startDate,
        lesson_end: endDate,
        age_min: this.model.age_min,
        age_max: this.model.age_max,
        participant_max: this.model.participant_max,
      }),
    );

    if (!updated?.id) {
      return;
    }

    this.dispatcher.dispatch(membershipLessonDetailsEvents.load({ id: lessonId }));
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
    const lessonId = this.getParamAsNumber('lessonId');

    if (!campaignId || !lessonId) {
      return;
    }

    const lesson = await firstValueFrom(this.lessonService.item(campaignId, lessonId));
    if (!lesson?.id) {
      return;
    }

    this.model = {
      title: lesson.title || '',
      day: new Date(lesson.lesson_start).getDay(),
      lesson_start: this.toDateInputValue(lesson.lesson_start),
      lesson_end: this.toDateInputValue(lesson.lesson_end),
      age_min: lesson.age_min || 0,
      age_max: lesson.age_max || 0,
      participant_max: lesson.participant_max || 0,
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
