import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import type { Lesson } from '../../../../../../../models/membership/lesson';
import type { Session } from '../../../../../../../models/membership/session';
import { formatDay, formatTime } from '../../../../../../../utils/date';
import { Collection } from '../../../../../../ui/collection/collection';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup } from '@angular/forms';
import type { EditableSession } from '../info.models';
import { ConfirmDialogService } from '../../../../../../../services/ui/confirm-dialog.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-membership-subscription-details-sessions-section',
  imports: [Collection, MatDialogModule, MatButtonModule, FormlyModule],
  templateUrl: './sessions.html',
  styleUrl: './sessions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsSection {
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly confirmDialogService = inject(ConfirmDialogService);

  lessons = input<Lesson[]>([]);
  sessions = input<Session[]>([]);
  sessionsChange = output<Pick<Session, 'id' | 'lesson_id' | 'subscription_id'>[]>();

  form = new FormGroup({});
  fields = signal<FormlyFieldConfig[]>([
    {
      key: 'lesson_id',
      type: 'select',
      props: {
        label: 'Lesson',
        options: [],
      },
    },
  ]);
  model: EditableSession = this.emptyModel();

  private readonly formTpl = viewChild<TemplateRef<any>>('formTpl');

  constructor() {
    effect(() => {
      this.fields.update((fields) => {
        const field = fields[0];
        if (field && field.props) {
          field.props.options = this.lessons().map((lesson) => ({
            label: formatDay(lesson.day) + ' ' + formatTime(lesson.lesson_start) + '-' + formatTime(lesson.lesson_end),
            value: lesson.id,
          }));
        }

        return fields;
      });
    });
  }

  sessionTitle(session: Session): string {
    const lesson = this.lessons().find((lesson) => lesson.id === session.lesson_id);
    return lesson?.title || 'Cours non renseigne';
  }

  sessionSubtitle(session: Session): string {
    const lesson = this.lessons().find((lesson) => lesson.id === session.lesson_id);
    if (!lesson) {
      return '';
    }
    return (
      formatDay(lesson.day) +
      '-' +
      formatTime(lesson.lesson_start) +
      '-' +
      formatTime(lesson.lesson_end)
    );
  }

  onAddItem(): void {
    const formTpl = this.formTpl();
    if (!formTpl) {
      return;
    }

    this.model = this.emptyModel();

    this.dialog
      .open(formTpl)
      .afterClosed()
      .subscribe((result: EditableSession | null) => {
        if (!result || !result.lesson_id) {
          return;
        }

        const next: Pick<Session, 'id' | 'lesson_id' | 'subscription_id'> = {
          id: 0,
          lesson_id: result.lesson_id,
          subscription_id: this.sessions()[0]?.subscription_id || 0,
        };

        this.sessionsChange.emit([...this.sessions(), next]);
      });
  }

  async onItemClick(event: { index: number }): Promise<void> {
    const session = this.sessions()[event.index];
    if (!session) {
      return;
    }

    const lesson = this.lessons().find((item) => item.id === session.lesson_id);
    const lessonLabel = lesson
      ? `${formatDay(lesson.day)} ${formatTime(lesson.lesson_start)}-${formatTime(lesson.lesson_end)}`
      : `Session #${session.id}`;

    const confirmed = await firstValueFrom(
      this.confirmDialogService.confirm({
        title: 'Supprimer la session',
        message: `Voulez-vous vraiment supprimer la session ${lessonLabel} ?`,
        confirmLabel: 'Supprimer',
        cancelLabel: 'Annuler',
        confirmColor: 'warn',
      }),
    );

    if (!confirmed) {
      return;
    }

    this.sessionsChange.emit(this.sessions().filter((_, index) => index !== event.index));
  }

  private emptyModel(): EditableSession {
    return {
      key: '',
      id: null,
      lesson_id: null,
      subscription_id: null,
    };
  }
}
