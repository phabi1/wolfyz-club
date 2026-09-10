import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { Contact } from '../../../../../../models/membership/contact';
import { Badge } from '../../../../../ui/badge/badge';
import { Collection, CollectionItemAction } from '../../../../../ui/collection/collection';
import type { EditableContact } from '../info.models';
import { NotProvidedPipe } from "../../../../../../pipes/not-provided-pipe";

@Component({
  selector: 'app-membership-subscription-details-contacts-section',
  imports: [Collection, Badge, MatDialogModule, MatButtonModule, FormlyModule, NotProvidedPipe],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsSection {
  private readonly dialog = inject(MatDialog);
  private activeDialogRef: MatDialogRef<unknown> | null = null;
  readonly addContactDialogTitle = $localize`:@@membership.subscriptions.contacts.dialogAdd:Add contact`;
  readonly editContactDialogTitle = $localize`:@@membership.subscriptions.contacts.dialogEdit:Edit contact`;
  readonly addLabel = $localize`:@@common.button.add:Add`;
  readonly editLabel = $localize`:@@common.button.edit:Edit`;

  contacts = input<Contact[]>([]);
  busy = input<boolean>(false);
  contactsChange = output<Contact[]>();

  formMode: 'add' | 'edit' = 'add';
  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [
    {
      key: 'firstname',
      type: 'input',
      props: { label: $localize`:@@membership.subscriptions.contacts.firstName:First name`, required: true, maxLength: 120 },
      validators: {
        validation: [Validators.required],
      },
    },
    {
      key: 'lastname',
      type: 'input',
      props: { label: $localize`:@@membership.subscriptions.contacts.lastName:Last name`, required: true, maxLength: 120 },
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
      props: { label: $localize`:@@membership.subscriptions.contacts.phone:Phone`, maxLength: 50 },
    },
  ];
  model: EditableContact = this.emptyModel();

  itemActions = input<CollectionItemAction[]>([
    {
      label: $localize`:@@common.button.edit:Edit`,
      handler: ({ item, index }) => this.onItemEdit({ item, index }),
    },
    {
      label: $localize`:@@common.button.delete:Delete`,
      handler: ({ item, index }) => this.onDeleteItem({ item, index }),
    },
  ]);

  private editingIndex: number | null = null;
  private readonly formTpl = viewChild<TemplateRef<unknown>>('formTpl');

  fullName(firstname?: string, lastname?: string): string {
    const value = `${firstname || ''} ${lastname || ''}`.trim();
    return value;
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

  onItemEdit(event: { item: Contact; index: number }): void {
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

    const payload: Contact = {
      id: this.model.id || 0,
      firstname: this.model.firstname.trim(),
      lastname: this.model.lastname.trim(),
      email: this.model.email.trim() || '',
      phone: this.model.phone.trim() || '',
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

  onDeleteItem({item, index}: {item: Contact; index: number}): void {
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
