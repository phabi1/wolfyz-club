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
import { LessonService } from '../../../../../services/membership/lesson.service';

type LessonFormModel = {
  title: string;
  description: string;
  day: number;
  lesson_start: string;
  lesson_end: string;
  participant_max: number;
};

@Component({
  selector: 'app-pages-membership-campaign-lessons-new',
  imports: [MatDialogModule, MatButtonModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './new.html',
  styleUrl: './new.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly lessonService = inject(LessonService);
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
      key: 'description',
      type: 'textarea',
      props: { label: 'Description', rows: 3 },
    },
    {
      key: 'day',
      type: 'select',
      props: {
        label: 'Jour',
        required: true,
        options: [
          { label: 'Lundi', value: 1 },
          { label: 'Mardi', value: 2 },
          { label: 'Mercredi', value: 3 },
          { label: 'Jeudi', value: 4 },
          { label: 'Vendredi', value: 5 },
          { label: 'Samedi', value: 6 },
          { label: 'Dimanche', value: 0 },
        ],
      },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'lesson_start',
      type: 'input',
      props: { label: 'Heure de debut', type: 'time', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'lesson_end',
      type: 'input',
      props: { label: 'Heure de fin', type: 'time', required: true },
      validators: { validation: [Validators.required] },
    },
    {
      key: 'participant_max',
      type: 'input',
      props: {
        label: 'Participants max',
        type: 'number',
        min: 0,
      },
    },
  ];
  model: LessonFormModel = this.defaultModel();

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

    const lessonStart = this.toLessonDate(this.model.lesson_start);
    const lessonEnd = this.toLessonDate(this.model.lesson_end);

    if (!lessonStart || !lessonEnd || lessonEnd <= lessonStart) {
      return;
    }

    const created = await firstValueFrom(
      this.lessonService.create(campaignId, {
        title: this.model.title.trim(),
        description: this.model.description.trim(),
        day: this.model.day,
        lesson_start: lessonStart,
        lesson_end: lessonEnd,
        participant_max: this.model.participant_max,
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

  private defaultModel(): LessonFormModel {
    return {
      title: 'Nouveau cours',
      description: '',
      day: 1,
      lesson_start: '18:00',
      lesson_end: '19:00',
      participant_max: 0,
    };
  }

  private toLessonDate(value: string): Date | null {
    const [rawHour, rawMinute] = value.split(':');
    const hours = Number(rawHour);
    const minutes = Number(rawMinute);

    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
      return null;
    }

    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return null;
    }

    const date = new Date();
    date.setSeconds(0, 0);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}
