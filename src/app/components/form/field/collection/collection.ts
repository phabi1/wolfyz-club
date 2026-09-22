import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { FieldArrayType, FieldArrayTypeConfig, FormlyModule } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogService } from '../../../../services/ui/confirm-dialog.service';

type CollectionProps = {
  label: string;
  description?: string;
  itemTpl?: TemplateRef<unknown>;
  emptyText?: string;
  addText?: string;
  editText?: string;
  deleteText?: string;
};

@Component({
  selector: 'app-form-group-collection',
  imports: [
    FormlyModule,
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    NgTemplateOutlet,
    DragDropModule,
  ],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collection extends FieldArrayType<FieldArrayTypeConfig<CollectionProps>> {
  private readonly dialog = inject(MatDialog);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly dialogTpl = viewChild.required<TemplateRef<unknown>>('dialogTpl');

  readonly dialogIndex = signal<number | null>(null);
  readonly dialogMode = signal<'add' | 'edit'>('add');
  readonly dialogItem = computed(() => {
    const index = this.dialogIndex();
    if (index === null) {
      return null;
    }
    return this.field.fieldGroup?.[index] ?? null;
  });

  private backupItem: unknown = null;
  private activeDialogIndex: number | null = null;
  private activeDialogRef: MatDialogRef<unknown> | null = null;

  get itemTemplate(): TemplateRef<unknown> | null {
    return this.props.itemTpl ?? null;
  }

  displayItem(index: number): string {
    const value = this.model?.[index];
    if (value === undefined || value === null) {
      return '';
    }
    return JSON.stringify(value, null, 2);
  }

  addItem(): void {
    this.add(undefined, { id: 'new-' + Date.now() });

    const lastIndex = (this.field.fieldGroup?.length ?? 1) - 1;
    this.dialogMode.set('add');
    this.backupItem = null;
    this.openEditDialog(lastIndex);
  }

  editItem(index: number): void {
    const value = this.formControl.value?.[index];
    if (value === undefined) {
      return;
    }

    this.dialogMode.set('edit');
    this.backupItem = structuredClone(value);
    this.openEditDialog(index);
  }

  onDrop(event: CdkDragDrop<unknown[]>): void {
    if (event.previousIndex === event.currentIndex) {
      return;
    }

    this.reorderItems(event.previousIndex, event.currentIndex);
  }

  async deleteItem(index: number): Promise<void> {
    const confirmed = await firstValueFrom(
      this.confirmDialogService.confirm({
        title: $localize`:@@common.confirmation.title:Confirmation`,
        message: $localize`:@@common.collection.deleteConfirm:Do you really want to delete this item?`,
        confirmLabel: $localize`:@@common.button.delete:Delete`,
        cancelLabel: $localize`:@@common.button.cancel:Cancel`,
        confirmColor: 'warn',
      }),
    );

    if (!confirmed) {
      return;
    }

    this.remove(index);
  }

  saveDialog(): void {
    const itemField = this.dialogItem();
    if (!itemField) {
      return;
    }

    const control = itemField.formControl;
    if (control?.invalid) {
      control.markAllAsTouched();
      return;
    }

    this.activeDialogRef?.close(true);
  }

  private openEditDialog(index: number): void {
    const itemField = this.field.fieldGroup?.[index];
    if (!itemField) {
      return;
    }

    this.dialogIndex.set(index);
    this.activeDialogIndex = index;

    this.activeDialogRef = this.dialog.open(this.dialogTpl());
    this.activeDialogRef
      .afterClosed()
      .subscribe((saved: boolean) => this.closeDialog(saved === true));
  }

  private closeDialog(saved: boolean): void {
    const index = this.activeDialogIndex;
    const mode = this.dialogMode();

    if (!saved && index !== null) {
      if (mode === 'add') {
        this.remove(index);
      } else if (this.backupItem !== null) {
        const current = Array.isArray(this.formControl.value) ? [...this.formControl.value] : [];
        current[index] = this.backupItem;
        this.formControl.setValue(current);
      }
    }

    this.dialogIndex.set(null);
    this.activeDialogIndex = null;
    this.backupItem = null;
    this.activeDialogRef = null;
  }

  private reorderItems(from: number, to: number): void {
    const total = this.field.fieldGroup?.length ?? 0;
    if (from < 0 || to < 0 || from >= total || to >= total || from === to) {
      return;
    }

    const formArray = this.formControl as FormArray;
    const control = formArray.at(from);
    formArray.removeAt(from, { emitEvent: false });
    formArray.insert(to, control, { emitEvent: false });

    if (Array.isArray(this.model)) {
      moveItemInArray(this.model, from, to);
    }

    this.formControl.markAsDirty();
    this.formControl.updateValueAndValidity();

    const group = this.field.fieldGroup;
    if (group) {
      moveItemInArray(group, from, to);
      this.field.fieldGroup = [...group];
    }
  }
}
