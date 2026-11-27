import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { firstValueFrom } from 'rxjs';
import { type Permission, permissionLabel } from '../../../../models/user/permission';
import { AuthService } from '../../../../services/auth.service';
import { RoleService } from '../../../../services/user/role.service';
import { userRoleListEvents } from '../../../../stores/user/roles/list';
import { apiErrorMessage } from '../../../../utils/api-error';

type PermissionOption = { id: Permission; label: string; grantable: boolean };
type PermissionGroup = { label: string; options: PermissionOption[] };

const GROUP_LABELS: Record<string, string> = {
  users: $localize`:@@user.roles.group.administration:Administration`,
  roles: $localize`:@@user.roles.group.administration:Administration`,
  billing: $localize`:@@nav.default.billing:Billing`,
  membership: $localize`:@@nav.default.membership:Memberships`,
  event: $localize`:@@nav.default.events:Events`,
};

/**
 * Creation (/roles/new) and edition (/roles/:roleId/edit) dialog of a role.
 */
@Component({
  selector: 'app-pages-user-roles-edit',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly roleService = inject(RoleService);
  private readonly authService = inject(AuthService);
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly formTpl = viewChild.required<TemplateRef<unknown>>('formTpl');
  private dialogRef: MatDialogRef<unknown> | null = null;

  readonly roleId = this.route.snapshot.paramMap.get('roleId');
  readonly loading = signal(true);
  readonly processing = signal(false);
  readonly error = signal<string | null>(null);
  readonly catalogue = signal<{ id: string; description: string }[]>([]);
  readonly selected = signal<ReadonlySet<string>>(new Set());

  readonly form = new FormGroup({
    label: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(190)] }),
    description: new FormControl('', { nonNullable: true, validators: [Validators.maxLength(255)] }),
  });

  /** Permissions grouped by domain ("billing.view" => "billing"), in catalogue order. */
  readonly groups = computed<PermissionGroup[]>(() => {
    const groups = new Map<string, PermissionGroup>();
    for (const { id, description } of this.catalogue()) {
      const domain = id.split('.')[0];
      const label = GROUP_LABELS[domain] ?? domain;
      if (!groups.has(label)) {
        groups.set(label, { label, options: [] });
      }
      groups.get(label)!.options.push({
        id: id as Permission,
        label: permissionLabel(id, description),
        // The API refuses to grant permissions that the user does not have.
        grantable: this.authService.hasPermission(id as Permission),
      });
    }
    return [...groups.values()];
  });

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open(this.formTpl(), { width: '40rem', maxWidth: '96vw' });
    this.dialogRef.afterClosed().subscribe(() => this.router.navigate(['/roles']));
    this.load();
  }

  isSelected(id: string): boolean {
    return this.selected().has(id);
  }

  toggle(id: string, checked: boolean): void {
    const next = new Set(this.selected());
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    this.selected.set(next);
  }

  onCancel(): void {
    this.dialogRef?.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.processing()) {
      this.form.markAllAsTouched();
      return;
    }
    const { label, description } = this.form.getRawValue();
    const data = {
      label: label.trim(),
      description: description.trim() || null,
      // Catalogue order.
      permissions: this.catalogue()
        .map((p) => p.id as Permission)
        .filter((id) => this.selected().has(id)),
    };

    this.processing.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(
        this.roleId ? this.roleService.update(this.roleId, data) : this.roleService.create(data),
      );
      this.dispatcher.dispatch(userRoleListEvents.load());
      this.dialogRef?.close('submitted');
    } catch (error) {
      this.error.set(apiErrorMessage(error));
    } finally {
      this.processing.set(false);
    }
  }

  private async load(): Promise<void> {
    try {
      const [catalogue, role] = await Promise.all([
        firstValueFrom(this.roleService.permissions()),
        this.roleId ? firstValueFrom(this.roleService.item(this.roleId)) : Promise.resolve(null),
      ]);
      this.catalogue.set(catalogue);
      if (role) {
        this.form.setValue({ label: role.label, description: role.description ?? '' });
        this.selected.set(new Set(role.permissions));
      }
    } catch (error) {
      this.error.set(apiErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }
}
