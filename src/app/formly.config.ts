import { provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { withFormlyFieldDatepicker } from '@ngx-formly/material/datepicker';
import { withFormlyFieldToggle } from '@ngx-formly/material/toggle';
import { AddressFieldType } from './components/form/field/address/address';
import { Collection } from './components/form/field/collection/collection';
import { PhoneFieldType } from './components/form/field/phone/phone';
import { UploadFieldType } from './components/form/field/upload/upload';
import { AmountFieldType } from './components/ui/formly/fields/amount/amount-field';
import { TabsFieldType } from './components/ui/formly/fields/tabs/tabs-field';

/** Formly field types of the application (also used by the unit tests). */
export function provideFormly() {
  return provideFormlyCore([
    ...withFormlyMaterial(),
    withFormlyFieldToggle(),
    withFormlyFieldDatepicker(),
    {
      types: [
        { name: 'tabs', component: TabsFieldType },
        { name: 'amount', component: AmountFieldType },
        {
          name: 'address',
          component: AddressFieldType,
          defaultOptions: {
            defaultValue: { line1: '', line2: '', zipcode: '', city: '', country: '' },
          },
        },
        {
         name: 'phone',
         component: PhoneFieldType,
        },
        {
          name: 'upload',
          component: UploadFieldType,
        },
        {
          name: 'collection',
          component: Collection
        }
      ],
    },
  ]);
}
