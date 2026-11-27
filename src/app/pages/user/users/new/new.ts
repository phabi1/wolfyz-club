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
import { Router } from '@angular/router';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { firstValueFrom } from 'rxjs';
import { RoleService } from '../../../../services/user/role.service';
import { UserService } from '../../../../services/user/user.service';
import { apiErrorMessage } from '../../../../utils/api-error';
import { emptyUserFormModel, userFormFields, UserFormModel } from '../form';

@Component({
  selector: 'app-pages-user-users-new',
  imports: [MatDialogModule, MatButtonModule, MatProgressSpinnerModule, FormlyModule, ReactiveFormsModule],
  templateUrl: './new.html',
  styleUrl: './new.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class New implements AfterViewInit {
  private readonly dialog = inject(MatDialog);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  private readonly formTpl = viewChild.required<TemplateRef<unknown>>('formTpl');
  private dialogRef: MatDialogRef<unknown> | null = null;

  readonly processing = signal(false);
  readonly error = signal<string | null>(null);

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = userFormFields('create', inject(RoleService).items());
  model: UserFormModel = emptyUserFormModel();

  ngAfterViewInit(): void {
    this.dialogRef = this.dialog.open(this.formTpl(), { width: '38rem', maxWidth: '96vw' });
    this.dialogRef.afterClosed().subscribe((result) => {
      if (result !== 'submitted') {
        this.router.navigate(['/users'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  onCancel(): void {
    this.dialogRef?.close();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.processing()) {
      this.form.markAllAsTouched();
      return;
    }

    this.processing.set(true);
    this.error.set(null);
    try {
      const user = await firstValueFrom(
        this.userService.create({
          firstname: this.model.firstname.trim(),
          lastname: this.model.lastname.trim(),
          email: this.model.email.trim(),
          password: this.model.password || undefined,
          email_verified: this.model.email_verified,
          roles: this.model.roles,
        }),
      );
      this.dialogRef?.close('submitted');
      await this.router.navigate(['/users', user.id]);
    } catch (error) {
      this.error.set(apiErrorMessage(error));
    } finally {
      this.processing.set(false);
    }
  }
}
