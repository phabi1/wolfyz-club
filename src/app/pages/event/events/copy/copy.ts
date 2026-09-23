import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EMPTY, switchMap } from 'rxjs';
import { EventService } from '../../../../services/event/event.service';
import { CopyDialog, CopyDialogData } from './dialog/copy-dialog';

@Component({
  selector: 'app-copy',
  imports: [MatDialogModule],
  templateUrl: './copy.html',
  styleUrl: './copy.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Copy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly eventService = inject(EventService);

  protected readonly loading = signal(false);

  constructor() {
    const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
    if (!Number.isFinite(eventId) || eventId <= 0) {
      this.router.navigate(['/event/events']);
      return;
    }

    this.eventService
      .item(eventId)
      .pipe(
        switchMap((event) => {
          const dialogRef = this.dialog.open(CopyDialog, {
            data: {
              title: event.title,
            } as CopyDialogData,
            disableClose: true,
            width: '480px',
          });

          return dialogRef.afterClosed().pipe(
            switchMap((newTitle: string | undefined) => {
              if (!newTitle) {
                this.router.navigate(['/event/events', eventId]);
                return EMPTY;
              }

              this.loading.set(true);
              return this.eventService.copy(eventId, newTitle);
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (copiedEvent) => {
          this.loading.set(false);
          this.router.navigate(['/event/events', copiedEvent.id]);
        },
        error: () => {
          this.loading.set(false);
          this.router.navigate(['/event/events', eventId]);
        },
      });
  }
}
