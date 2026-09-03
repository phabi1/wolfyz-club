import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Collection } from '../../../../../../ui/collection/collection';
import type { Subscription } from '../../../../../../../models/membership/subscription';
import type { EditableContact } from '../info.models';
import { FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';

type SubscriptionContact = Subscription['contacts'][number];

@Component({
  selector: 'app-membership-subscription-details-contacts-section',
  imports: [Collection, MatDialogModule, MatButtonModule, FormlyModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsSection {
  private readonly dialog = inject(MatDialog);
  private activeDialogRef: MatDialogRef<unknown> | null = null;

  contacts = input<SubscriptionContact[]>([]);
  contactsChange = output<SubscriptionContact[]>();

  formMode: 'add' | 'edit' = 'add';
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'firstname',
      type: 'input',
      props: { label: 'Prenom', required: true, maxLength: 120 },
      validators: {
        validation: [Validators.required],
      },
    },
    {
      key: 'lastname',
      type: 'input',
      props: { label: 'Nom', required: true, maxLength: 120 },
      validators: {
        validation: [Validators.required],
      },
    },
    {
      key: 'email',
      type: 'input',
      props: { label: 'Email', type: 'email', maxLength: 255 },
      validators: {
        validation: [Validators.email],
      },
    },
    {
      key: 'phone',
      type: 'input',
      props: { label: 'Telephone', maxLength: 50 },
    },
  ];
  model: EditableContact = this.emptyModel();

  private editingIndex: number | null = null;
  private readonly formTpl = viewChild<TemplateRef<unknown>>('formTpl');

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value || 'Non renseigne';
  }

  contactEmail(contact: SubscriptionContact): string {
    return contact.email || 'Non renseigne';
  }

  contactPhone(contact: SubscriptionContact): string {
    return contact.phone || 'Non renseigne';
  }

  onAddItem(): void {
    const formTpl = this.formTpl();
    if (!formTpl) {
      return;
    }

    this.formMode = 'add';
    this.editingIndex = null;
    this.model = this.emptyModel();
    this.openDialog(formTpl);
  }

  onItemClick(event: { index: number }): void {
    const formTpl = this.formTpl();
    if (!formTpl) {
      return;
    }

    const current = this.contacts()[event.index];
    if (!current) {
      return;
    }

    this.formMode = 'edit';
    this.editingIndex = event.index;
    this.model = {
      key: String(current.id),
      id: current.id,
      firstname: current.firstname || '',
      lastname: current.lastname || '',
      email: current.email || '',
      phone: current.phone || '',
    };
    this.openDialog(formTpl);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: SubscriptionContact = {
      id: this.model.id || 0,
      firstname: this.model.firstname.trim(),
      lastname: this.model.lastname.trim(),
      email: this.model.email.trim() || undefined,
      phone: this.model.phone.trim() || undefined,
    };

    if (this.formMode === 'add') {
      this.contactsChange.emit([...this.contacts(), payload]);
      this.activeDialogRef?.close();
      return;
    }

    const index = this.editingIndex;
    if (index === null) {
      return;
    }

    const updated = this.contacts().map((contact, i) => {
      if (i !== index) {
        return contact;
      }
      return {
        ...contact,
        ...payload,
      };
    });

    this.contactsChange.emit(updated);
    this.activeDialogRef?.close();
  }

  onDelete(): void {
    const index = this.editingIndex;
    if (index === null) {
      return;
    }

    this.contactsChange.emit(this.contacts().filter((_, i) => i !== index));
    this.activeDialogRef?.close();
  }

  private openDialog(formTpl: TemplateRef<unknown>): void {
    this.form.reset();

    this.activeDialogRef = this.dialog.open(formTpl);
    this.activeDialogRef.afterClosed().subscribe(() => {
      this.activeDialogRef = null;
      this.editingIndex = null;
      this.form.reset();
    });
  }

  private emptyModel(): EditableContact {
    return {
      key: '',
      id: null,
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
    };
  }
}
