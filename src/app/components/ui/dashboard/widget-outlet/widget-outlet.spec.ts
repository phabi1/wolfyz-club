import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetOutlet } from './widget-outlet';

describe('WidgetOutlet', () => {
  let component: WidgetOutlet;
  let fixture: ComponentFixture<WidgetOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetOutlet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
