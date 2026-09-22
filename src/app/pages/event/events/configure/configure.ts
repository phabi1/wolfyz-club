import { AfterViewInit, Component, effect, inject, TemplateRef, viewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Dispatcher } from '@ngrx/signals/events';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { Page } from '../../../../components/ui/page/page';
import { AmountPipe } from '../../../../pipes/amount-pipe';
import {
  eventEventConfigureEvents,
  eventEventConfigureStore,
} from '../../../../stores/event/events/configure';
import { toDate, toInput } from '../../../../utils/date';
import { FieldType } from '../../../../components/ui/field-type/field-type';

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
  imports: [Page, FormlyForm, FormsModule, MatButtonModule, AmountPipe, FieldType],
  providers: [eventEventConfigureStore],
  templateUrl: './configure.html',
  styleUrl: './configure.css',
})
export class Configure implements AfterViewInit {
  public readonly store = inject(eventEventConfigureStore);
  private readonly dispatcher = inject(Dispatcher);
  public readonly ticketTpl = viewChild<TemplateRef<any>>('ticketItemTpl');
  public readonly fieldTpl = viewChild<TemplateRef<any>>('fieldItemTpl');
  public readonly sessionTpl = viewChild<TemplateRef<any>>('sessionItemTpl');
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
        tickets: item.tickets
          ? item.tickets.map((ticket) => ({ ...ticket, id: ticket.id.toString() }))
          : [],
        participant_fields: item.participant_fields
          ? item.participant_fields.map((field) => ({
              ...field,
              id: field.id.toString(),
              tickets: (field.tickets || []).map((ticketId) => ticketId.toString()),
            }))
          : [],
        sessions: item.sessions
          ? item.sessions.map((session) => ({
              ...session,
              id: session.id.toString(),
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
                      key: 'participant_max',
                      type: 'input',
                      props: {
                        type: 'number',
                        label: 'Participant Max',
                      },
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
                            value: 'boolean',
                          },
                          {
                            label: 'Phone',
                            value: 'phone',
                          },
                          {
                            label: 'File',
                            value: 'file',
                          },
                          {
                            label: 'Options',
                            value: 'options',
                          },
                        ],
                      },
                    },
                    {
                      key: 'label',
                      type: 'input',
                      props: { label: 'Field Label', required: true },
                    },
                    {
                      key: 'required',
                      type: 'toggle',
                      props: { label: 'Required' },
                      wrappers: [],
                      className: 'pb-4',
                    },
                    { key: 'description', type: 'textarea', props: { label: 'Description' } },
                    {
                      key: 'tickets',
                      type: 'multicheckbox',
                      props: {
                        label: 'Tickets',
                        type: 'array',
                        options: [],
                      },
                      hooks: {
                        onInit: (field) => {
                          const tickets: { id: string; title: string; price: number }[] =
                            this.model.tickets || [];
                          if (field.props) {
                            field.props.options = tickets.map((ticket) => ({
                              label: ticket.title,
                              value: ticket.id,
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
        tickets: (this.model.tickets || []).map((ticket) => ({
          ...ticket,
          id: ticket.id.startsWith('new-') ? undefined : ticket.id,
        })),
        sessions: (this.model.sessions || []).map((session) => ({
          ...session,
          id: session.id.startsWith('new-') ? undefined : session.id,
        })),
        participant_fields: (this.model.participant_fields || []).map((field) => ({
          ...field,
          id: field.id.startsWith('new-') ? undefined : field.id,
        })),
      };
      this.dispatcher.dispatch(eventEventConfigureEvents.save({ data }));
    }
  }

  public getTicketNames(tickets: string[]): string {
    return tickets
      .map((ticketId) => {
        const ticket = this.model.tickets?.find((t) => t.id == ticketId);
        return ticket ? ticket.title : null;
      })
      .filter((ticket) => ticket)
      .join(', ');
  }
}
