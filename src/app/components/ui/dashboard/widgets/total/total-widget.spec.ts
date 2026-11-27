import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalWidget } from './total-widget';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('TotalWidget', () => {
  let component: TotalWidget;
  let fixture: ComponentFixture<TotalWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalWidget],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(TotalWidget);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('count', 0);
    fixture.componentRef.setInput('title', 'Total');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
