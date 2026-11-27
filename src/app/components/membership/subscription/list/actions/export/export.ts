import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs/operators';
import { SubscriptionExportService } from '../../../../../../services/membership/subscription-export.service';

interface ExportDialogData {
  campaignId: string | null;
  ids: string[];
  reverse: boolean;
}

@Component({
  selector: 'app-membership-subscription-list-actions-export',
  imports: [MatDialogModule, MatProgressSpinnerModule],
  templateUrl: './export.html',
  styleUrls: ['./export.css'],
})
export class Export implements OnInit {
  public isGenerating = true;
  public errorMessage: string | null = null;

  public constructor(
    private readonly exportService: SubscriptionExportService,
    private readonly dialogRef: MatDialogRef<Export>,
    @Inject(MAT_DIALOG_DATA) private readonly data: ExportDialogData | null,
  ) {}

  public ngOnInit(): void {
    this.dialogRef.disableClose = true;
    this.generateAndDownload();
  }

  private generateAndDownload(): void {
    if (!this.data?.campaignId) {
      this.isGenerating = false;
      this.dialogRef.disableClose = false;
      this.errorMessage = 'Aucune campagne sélectionnée.';
      return;
    }

    this.exportService
      .export(this.data.campaignId, { ids: this.data.ids, reverse: this.data.reverse })
      .pipe(
        finalize(() => {
          this.isGenerating = false;
          this.dialogRef.disableClose = false;
        }),
      )
      .subscribe({
        next: (file) => {
          this.exportService.download(file);
          this.dialogRef.close(true);
        },
        error: () => {
          this.errorMessage = "La génération de l'export a échoué.";
        },
      });
  }
}
