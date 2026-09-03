import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormlyFieldConfig, FieldType, FormlyModule } from '@ngx-formly/core';
import { MatTabsModule } from '@angular/material/tabs';

type TabField = FormlyFieldConfig & {
  props?: {
    label?: string;
  };
};

@Component({
  selector: 'app-formly-tabs-field',
  imports: [FormlyModule, MatTabsModule],
  templateUrl: './tabs-field.html',
  styleUrl: './tabs-field.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsFieldType extends FieldType {
  readonly activeTab = signal(0);

  get tabs(): TabField[] {
    const fieldGroup = this.field.fieldGroup as TabField[] | undefined;
    if (!fieldGroup || !fieldGroup.length) {
      return [];
    }

    const current = this.activeTab();
    if (current > fieldGroup.length - 1) {
      this.activeTab.set(0);
    }

    return fieldGroup;
  }

  labelAt(index: number): string {
    return this.tabs[index]?.props?.label || `Tab ${index + 1}`;
  }

  selectTab(index: number): void {
    this.activeTab.set(index);
  }
}
