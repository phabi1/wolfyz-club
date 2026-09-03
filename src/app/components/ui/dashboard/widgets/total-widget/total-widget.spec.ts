import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalWidget } from './total-widget';

describe('TotalWidget', () => {
  let component: TotalWidget;
  let fixture: ComponentFixture<TotalWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalWidget],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalWidget);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
