import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNo } from './yes-no';

describe('YesNo', () => {
  let component: YesNo;
  let fixture: ComponentFixture<YesNo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YesNo],
    }).compileComponents();

    fixture = TestBed.createComponent(YesNo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
