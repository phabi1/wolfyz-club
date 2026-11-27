import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export type CopyDialogData = {
  title: string;
};

@Component({
  selector: 'app-pages-event-events-copy-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './copy-dialog.html',
  styleUrl: './copy-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopyDialog {
  private readonly dialogRef = inject(MatDialogRef<CopyDialog, string | undefined>);
  protected readonly data = inject<CopyDialogData>(MAT_DIALOG_DATA);

  protected readonly titleControl = new FormControl(`${this.data.title} (copy)`, {
    nonNullable: true,
    validators: [Validators.required],
  });

  protected onCancel(): void {
    this.dialogRef.close(undefined);
  }

  protected onSubmit(): void {
    const nextTitle = this.titleControl.value.trim();
    if (!nextTitle) {
      this.titleControl.markAsTouched();
      return;
    }

    this.dialogRef.close(nextTitle);
  }
}
