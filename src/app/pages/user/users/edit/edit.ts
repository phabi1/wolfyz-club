import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Dispatcher } from '@ngrx/signals/events';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import type { UserUpdate } from '../../../../models/user/user';
import { AuthService } from '../../../../services/auth.service';
import { RoleService } from '../../../../services/user/role.service';
import { UserService } from '../../../../services/user/user.service';
import { userUserDetailsEvents } from '../../../../stores/user/users/details';
import { apiErrorMessage } from '../../../../utils/api-error';
import { emptyUserFormModel, userFormFields, UserFormModel } from '../form';

@Component({
  selector: 'app-pages-user-users-edit',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly roles$ = inject(RoleService).items();
  private readonly dispatcher = inject(Dispatcher);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly formTpl = viewChild.required<TemplateRef<unknown>>('formTpl');
  private dialogRef: MatDialogRef<unknown> | null = null;

  readonly loading = signal(true);
  readonly processing = signal(false);
  readonly error = signal<string | null>(null);
  private isSelf = false;

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: UserFormModel = emptyUserFormModel();

  private get userId(): string {
    return String(this.route.parent?.snapshot.paramMap.get('userId') ?? '');
  }

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open(this.formTpl(), { width: '38rem', maxWidth: '96vw' });
    this.dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/users', this.userId]);
    });
    this.prefill();
  }

  onCancel(): void {
    this.dialogRef?.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.processing()) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: UserUpdate = {
      firstname: this.model.firstname.trim(),
      lastname: this.model.lastname.trim(),
      email: this.model.email.trim(),
      email_verified: this.model.email_verified,
    };
    if (!this.isSelf) {
      payload.roles = this.model.roles;
    }
    if (this.model.password) {
      payload.password = this.model.password;
    }

    this.processing.set(true);
    this.error.set(null);
    try {
      await firstValueFrom(this.userService.update(this.userId, payload));
      this.dispatcher.dispatch(userUserDetailsEvents.load({ id: this.userId }));
      this.dialogRef?.close('submitted');
    } catch (error) {
      this.error.set(apiErrorMessage(error));
    } finally {
      this.processing.set(false);
    }
  }

  private async prefill(): Promise<void> {
    try {
      const user = await firstValueFrom(this.userService.item(this.userId));
      this.model = {
        firstname: user.firstname ?? '',
        lastname: user.lastname ?? '',
        email: user.email,
        password: '',
        email_verified: user.email_verified,
        roles: user.roles.map((role) => role.id),
      };
      this.isSelf = user.id === this.authService.currentUserId();
      this.fields = userFormFields('edit', this.roles$, this.isSelf);
    } catch (error) {
      this.error.set(apiErrorMessage(error));
    } finally {
      this.loading.set(false);
    }
  }

}
