import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Link } from './link';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('Link', () => {
  let component: Link;
  let fixture: ComponentFixture<Link>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Link],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Link);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { type: 'link', label: 'Link', to: '/' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
