import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNo } from './yes-no';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('YesNo', () => {
  let component: YesNo;
  let fixture: ComponentFixture<YesNo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YesNo],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNo);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', true);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
