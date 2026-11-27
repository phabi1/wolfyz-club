import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultLayout } from './default';

describe('DefaultLayout', () => {
  let component: DefaultLayout;
  let fixture: ComponentFixture<DefaultLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(DefaultLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
