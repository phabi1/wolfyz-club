import { AfterViewInit, Component, TemplateRef, computed, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { eventEventInfoStore } from '../../../../stores/event/events/info';
import type { ParticipantField } from '../../../../models/event/participant-field';
import { DetailItem } from '../../../../components/ui/details/detail-item';
import { Details } from '../../../../components/ui/details/details';
import { NotProvidedPipe } from '../../../../pipes/not-provided-pipe';

@Component({
  selector: 'app-pages-event-events-info',
  imports: [MatDialogModule, MatButtonModule, Details, DetailItem, NotProvidedPipe],
  providers: [eventEventInfoStore],
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements AfterViewInit {
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public readonly store = inject(eventEventInfoStore);
  public readonly dialogTpl = viewChild<TemplateRef<unknown>>('dialogTpl');
  public readonly availableFields = computed(() => {
    const participant = this.store.item();
    const fields = this.store.fields();
    const ticketId = participant?.ticket?.id;

    if (ticketId === undefined || ticketId === null) {
      return [];
    }

    const ticketIdAsString = String(ticketId);
    return fields
      .filter((field) => field.tickets.includes(ticketIdAsString))
      .sort((a, b) => a.weight - b.weight);
  });

  public fieldValue(field: ParticipantField): string {
    const fields = this.store.item()?.fields;
    if (!fields) {
      return '';
    }

    const rawValue = fields[String(field.id)];
    if (rawValue === null || rawValue === undefined || rawValue === '') {
      return '';
    }

    if (Array.isArray(rawValue)) {
      return rawValue.join(', ');
    }

    if (typeof rawValue === 'object') {
      return JSON.stringify(rawValue);
    }

    return String(rawValue);
  }

  ngAfterViewInit(): void {
    const dialogTpl = this.dialogTpl();
    if (dialogTpl) {
      this.dialog
        .open(dialogTpl)
        .afterClosed()
        .subscribe(() => {
          this.router.navigate(['../..'], { relativeTo: this.route });
        });
    }
  }
}
