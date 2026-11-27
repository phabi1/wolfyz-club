import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Details } from './details';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('Details', () => {
  let component: Details;
  let fixture: ComponentFixture<Details>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Details],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Details);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
