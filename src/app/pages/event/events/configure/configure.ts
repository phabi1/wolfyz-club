import { AfterViewInit, Component, effect, inject, TemplateRef, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Dispatcher } from '@ngrx/signals/events';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { Ticket } from '../../../../models/event/ticket';
import { Session } from '../../../../models/event/session';
import { ParticipantField } from '../../../../models/event/participant-field';
import { Page } from '../../../../components/ui/page/page';
import {
  eventEventConfigureEvents,
  eventEventConfigureStore,
} from '../../../../stores/event/events/configure';
import { MatButtonModule } from '@angular/material/button';
import { toDate, toInput } from '../../../../utils/date';

type EventModel = {
  title: string;
  event_start: string;
  event_end: string;
  registratable: boolean;
  registration_start: string;
  registration_end: string;
  participant_max: number;
  tickets: any[];
  participant_fields: any[];
  sessions: any[];
};

@Component({
  selector: 'app-configure',
  imports: [Page, FormlyForm, FormsModule, MatButtonModule],
  providers: [eventEventConfigureStore],
  templateUrl: './configure.html',
  styleUrl: './configure.css',
})
export class Configure implements AfterViewInit {
  public readonly store = inject(eventEventConfigureStore);
  private readonly dispatcher = inject(Dispatcher);
  public readonly ticketTpl = viewChild<TemplateRef<any>>('ticketTpl');
  public readonly fieldTpl = viewChild<TemplateRef<any>>('fieldTpl');
  public readonly sessionTpl = viewChild<TemplateRef<any>>('sessionTpl');
  public readonly form = new FormGroup({});
  public fields: FormlyFieldConfig[] = [];
  public model: EventModel = {
    title: '',
    event_start: '',
    event_end: '',
    registratable: false,
    registration_start: '',
    registration_end: '',
    participant_max: 0,
    tickets: [],
    participant_fields: [],
    sessions: [],
  };

  constructor() {
    effect(() => {
      const item = this.store.item();
      this.model = {
        title: item.title ?? '',
        event_start: item.event_start ? toInput(item.event_start) : '',
        event_end: item.event_end ? toInput(item.event_end) : '',
        registratable: item.registration_start !== null || item.registration_end !== null,
        registration_start: item.registration_start ? toInput(item.registration_start) : '',
        registration_end: item.registration_end ? toInput(item.registration_end) : '',
        participant_max: item.participant_max ?? 0,
        tickets: item.tickets ? item.tickets.map((ticket) => ({ ...ticket })) : [],
        participant_fields: item.participant_fields
          ? item.participant_fields.map((field) => ({ ...field }))
          : [],
        sessions: item.sessions
          ? item.sessions.map((session) => ({
              ...session,
              session_start: toInput(session.session_start),
              session_end: toInput(session.session_end),
            }))
          : [],
      };
    });
  }

  public ngAfterViewInit(): void {
    this.fields = [
      {
        type: 'tabs',
        fieldGroup: [
          {
            props: { label: 'General' },
            fieldGroup: [
              { key: 'title', type: 'input', props: { label: 'Title', required: true } },
              {
                fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4',
                fieldGroup: [
                  {
                    key: 'event_start',
                    type: 'input',
                    props: { label: 'Start Date', required: true },
                  },
                  { key: 'event_end', type: 'input', props: { label: 'End Date', required: true } },
                ],
              },
              {
                key: 'registratable',
                type: 'toggle',
                props: { label: 'Registratable' },
                wrappers: [],
              },
              {
                fieldGroupClassName: 'grid grid-cols-1 md:grid-cols-2 gap-4 mt-4',
                fieldGroup: [
                  {
                    key: 'registration_start',
                    type: 'input',
                    props: { label: 'Registration Start Date', required: true },
                  },
                  {
                    key: 'registration_end',
                    type: 'input',
                    props: { label: 'Registration End Date', required: true },
                  },
                ],
                hideExpression: (model) => !model.registratable,
              },
              {
                key: 'participant_max',
                type: 'input',
                props: { label: 'Participant Max' },
              },
            ],
          },
          {
            props: {
              label: 'Sessions',
            },
            fieldGroup: [
              {
                key: 'sessions',
                type: 'collection',
                props: { label: 'Sessions', itemTpl: this.sessionTpl() },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'session_start',
                      type: 'input',
                      props: { type: 'datepicker', label: 'Start Date', required: true },
                    },
                    {
                      key: 'session_end',
                      type: 'input',
                      props: { type: 'datepicker', label: 'End Date', required: true },
                    },
                  ],
                },
              },
            ],
          },
          {
            props: { label: 'Tickets' },
            fieldGroup: [
              {
                key: 'tickets',
                type: 'collection',
                props: { label: 'Tickets', itemTpl: this.ticketTpl() },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'title',
                      type: 'input',
                      props: { label: 'Title', required: true },
                    },
                    {
                      key: 'amount',
                      type: 'input',
                      props: { type: 'number', label: 'Amount', required: true },
                    },
                    {
                      key: 'quantity',
                      type: 'input',
                      props: { type: 'number', label: 'Quantity' },
                    },
                    {
                      key: 'member_only',
                      type: 'toggle',
                      props: { label: 'Member Only' },
                    },
                  ],
                },
              },
            ],
          },
          {
            props: { label: 'Participant' },
            fieldGroup: [
              {
                key: 'participant_fields',
                type: 'collection',
                props: { label: 'Fields', itemTpl: this.fieldTpl() },
                fieldArray: {
                  fieldGroup: [
                    {
                      key: 'label',
                      type: 'input',
                      props: { label: 'Field Label', required: true },
                    },
                    {
                      key: 'type',
                      type: 'select',
                      props: {
                        label: 'Field Type',
                        required: true,
                        options: [
                          {
                            label: 'Text',
                            value: 'text',
                          },
                          {
                            label: 'Number',
                            value: 'number',
                          },
                          {
                            label: 'Email',
                            value: 'email',
                          },
                          {
                            label: 'Date',
                            value: 'date',
                          },
                          {
                            label: 'Address',
                            value: 'address',
                          },
                          {
                            label: 'Checkbox',
                            value: 'checkbox',
                          },
                        ],
                      },
                    },
                    {
                      key: 'required',
                      type: 'toggle',
                      props: { label: 'Required' },
                      wrappers: [],
                    },
                    { key: 'description', type: 'textarea', props: { label: 'Description' } },
                    {
                      key: 'tickets',
                      type: 'multicheckbox',
                      props: {
                        label: 'Tickets',
                        options: [],
                      },
                      hooks: {
                        onInit: (field) => {
                          // Initialize the tickets options dynamically
                          const tickets: { name: string; price: number }[] =
                            field.form?.get('tickets')?.value || [];
                          if (field.props) {
                            field.props.options = tickets.map((ticket) => ({
                              label: ticket.name,
                              value: ticket.name,
                            }));
                          }
                        },
                      },
                    },
                    {
                      key: 'options',
                      type: 'input',
                      props: { label: 'Options (comma separated)' },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ];
  }

  public onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const data = {
        ...this.model,
        event_start: toDate(this.model.event_start),
        event_end: toDate(this.model.event_end),
        registration_start: this.model.registration_start
          ? toDate(this.model.registration_start)
          : null,
        registration_end: this.model.registration_end ? toDate(this.model.registration_end) : null,
        tickets: this.model.tickets || [],
        sessions: this.model.sessions || [],
        participant_fields: this.model.participant_fields || [],
      };
      console.log(data);
      this.dispatcher.dispatch(eventEventConfigureEvents.save({ data }));
    }
  }
}
