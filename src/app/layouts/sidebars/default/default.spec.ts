import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Default } from './default';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Default', () => {
  let component: Default;
  let fixture: ComponentFixture<Default>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Default],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Default);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
