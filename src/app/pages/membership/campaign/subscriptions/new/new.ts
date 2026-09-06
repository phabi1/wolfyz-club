import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyModule } from '@ngx-formly/core';
import { of, switchMap } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { Member as MemberField } from '../../../../../components/membership/subscription/new/form/member/member';
import { Page } from '../../../../../components/ui/page/page';
import { LessonService } from '../../../../../services/membership/lesson.service';
import { MemberService } from '../../../../../services/membership/member.service';
import { SessionService } from '../../../../../services/membership/session.service';
import { SubscriptionService } from '../../../../../services/membership/subscription.service';
import { formatLessonTitle } from '../../../../../utils/lesson';

type NewModel = {
  member: {
    lastname: string;
    firstname: string;
    birthdate: string;
    id: string;
  };
  lesson_id: string;
  license_type: string;
};

@Component({
  selector: 'app-pages-membership-campaign-subscriptions-new',
  imports: [Page, ReactiveFormsModule, FormlyModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './new.html',
  styleUrls: ['./new.css'],
})
export class New {
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly lessonService = inject(LessonService);
  private readonly memberService = inject(MemberService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly sessionService = inject(SessionService);

  form = new FormGroup({});
  model: NewModel = {
    member: {
      lastname: '',
      firstname: '',
      birthdate: '',
      id: '',
    },
    lesson_id: '',
    license_type: '',
  };
  fields = [
    {
      key: 'member',
      type: MemberField,
      props: {
        label: $localize`:@@membership.subscriptions.form.member:Member`,
        placeholder: $localize`:@@membership.subscriptions.form.memberPlaceholder:Select a member`,
        required: true,
      },
    },
    {
      key: 'license_type',
      type: 'select',
      props: {
        label: $localize`:@@membership.subscriptions.form.licenseType:License type`,
        placeholder: $localize`:@@membership.subscriptions.form.licenseTypePlaceholder:Select a license type`,
        required: true,
        options: [
          { label: $localize`:@@membership.subscriptions.form.licenseHobby:Hobby`, value: 'hobby' },
          { label: $localize`:@@membership.subscriptions.form.licenseCompetition:Competition`, value: 'competition' },
        ],
      },
    },
    {
      key: 'lesson_id',
      type: 'select',
      props: {
        label: $localize`:@@membership.subscriptions.form.lesson:Lesson`,
        placeholder: $localize`:@@membership.subscriptions.form.lessonPlaceholder:Select a lesson`,
        required: true,
        options: this.lessonService
          .items(2)
          .pipe(
            map((res) =>
              res.items.map((item) => ({ label: formatLessonTitle(item), value: item.id })),
            ),
          ),
      },
    },
  ];

  submit() {
    if (this.form.valid) {
      const values = this.form.value as NewModel;
      const member = values.member;
      const campaignId = 2;

      let action;
      if (member.id === 'new') {
        action = this.memberService
          .create({
            firstname: member.firstname,
            lastname: member.lastname,
            birthdate: member.birthdate,
          })
          .pipe(map((member) => member.id.toString()));
      } else {
        action = of(member.id);
      }

      action
        .pipe(
          switchMap((memberId) =>
            this.subscriptionService
              .create(campaignId, {
                member_id: +memberId,
                license_type: values.license_type,
                address: {
                  line1: '',
                  line2: '',
                  city: '',
                  zipcode: '',
                  country: '',
                },
                subscribed_at: new Date(),
              })
              .pipe(
                switchMap((subscription) =>
                  this.sessionService
                    .create(campaignId, {
                      subscription_id: subscription.id,
                      member_id: +memberId,
                      lesson_id: +values.lesson_id,
                    })
                    .pipe(map(() => subscription)),
                ),
              ),
          ),
        )
        .subscribe({
          next: (subscription) => {
            this.router.navigate(['../', subscription.id], { relativeTo: this.route });
          },
          error: (err) => {
            let message = $localize`:@@common.error.default:An error occurred`;
            if (err.error && err.error.errors && err.error.errors.duplicate) {
              message = $localize`:@@membership.subscriptions.error.duplicateMember:A member with this information already exists for this campaign`;
            }
            this.snackBar.open(message, $localize`:@@common.button.close:Close`, {
              duration: 3000,
            });
          },
        });
    }
  }
}
