import { Component, inject, signal } from '@angular/core';
import { forwardRef } from '@angular/core';
import { FormBuilder, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FieldTypeConfig } from '@ngx-formly/core';
import { FieldType } from '@ngx-formly/core';
import { MemberService } from '../../../../../../services/membership/member.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-membership-campaign-subscriptions-new-member',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './member.html',
  styleUrls: ['./member.css'],
})
export class Member extends FieldType<FieldTypeConfig> {
  private readonly memberService = inject(MemberService);

  public memberForm = inject(FormBuilder).group({
    lastname: ['', Validators.required],
    firstname: ['', Validators.required],
    birthdate: [''],
  });

  state = signal<'form' | 'suggestions'>('form');

  valid = signal(false);
  searching = signal(false);
  suggestions = signal<any[]>([]);
  member_id = '';

  search() {
    this.searching.set(true);
    const { lastname, firstname, birthdate } = this.memberForm.value;
    this.memberService
      .exists(
        {
          lastname: lastname || '',
          firstname: firstname || '',
          birthdate: birthdate || '',
        },
        true,
      )
      .subscribe((result) => {
        if (result.exists && result.member) {
          const member = result.member;
          let birthdate = '';
          if (member.birthdate) {
            birthdate = new Date(member.birthdate).toISOString().split('T')[0];
          }
          const suggestion = {
            id: member.id,
            lastname: member.lastname || '',
            firstname: member.firstname || '',
            birthdate: birthdate || '',
          };
          this.suggestions.set([suggestion]);
          this.member_id = member.id.toString();
          this.formControl.setValue(suggestion);
          this.state.set('suggestions');
        } else {
          this.suggestions.set(result.suggestions);
          this.state.set('suggestions');
        }

        this.searching.set(false);
      });
  }

  back() {
    this.member_id = '';
    this.formControl.setValue('');
    this.suggestions.set([]);
    this.state.set('form');
  }

  onModelChange(event: string) {
    if (event === 'new') {
      const values = this.memberForm.value;
      this.formControl.setValue({
        lastname: values.lastname || '',
        firstname: values.firstname || '',
        birthdate: values.birthdate || '',
        id: 'new',
      });
    } else {
      const suggestion = this.suggestions().find((s) => s.id.toString() === event);
      if (suggestion) {
        this.formControl.setValue({
          lastname: suggestion.lastname,
          firstname: suggestion.firstname,
          birthdate: suggestion.birthdate,
          id: suggestion.id.toString(),
        });
      }
    }
  }
}
