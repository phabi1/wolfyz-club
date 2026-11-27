import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideDashboardWidgets } from '../widget-registry';

import { WidgetOutlet } from './widget-outlet';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('WidgetOutlet', () => {
  let component: WidgetOutlet;
  let fixture: ComponentFixture<WidgetOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetOutlet],
      providers: [provideTestDefaults(), provideDashboardWidgets({})],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetOutlet);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('type', 'unknown');
    fixture.componentRef.setInput('settings', {});
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
