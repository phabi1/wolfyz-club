import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Cell } from '../../../cell';

@Component({
  selector: 'app-ui-datagrid-table-cell-yes-no',
  template: `{{ value() ? yesLabel : noLabel }}`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YesNoCell extends Cell<boolean> {
  readonly yesLabel = $localize`:@@common.label.yes:Yes`;
  readonly noLabel = $localize`:@@common.label.no:No`;
}
