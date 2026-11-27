import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navbar } from './navbar';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('items', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
