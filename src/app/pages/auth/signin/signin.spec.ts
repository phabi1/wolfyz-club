import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signin } from './signin';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Signin', () => {
  let component: Signin;
  let fixture: ComponentFixture<Signin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signin],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Signin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
