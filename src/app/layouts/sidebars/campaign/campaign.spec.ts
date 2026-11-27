import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestDefaults } from '../../../../testing/test-providers';
import type { NavLink } from '../../../components/ui/navbar/nav-item';
import { AuthService } from '../../../services/auth.service';
import { Campaign } from './campaign';

describe('Campaign', () => {
  let component: Campaign;
  let fixture: ComponentFixture<Campaign>;
  const permissions = signal<string[]>([]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Campaign],
      providers: [
        provideTestDefaults(),
        {
          provide: AuthService,
          useValue: {
            permissions,
            hasPermission: (...anyOf: string[]) => anyOf.some((p) => permissions().includes(p)),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Campaign);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const labels = () => component.links().map((link) => (link as NavLink).label);

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows only the sections the permissions give access to', () => {
    permissions.set(['membership.request.view']);
    expect(labels()).toEqual(['Dashboard', 'Requests']);

    permissions.set(['membership.campaign.view', 'membership.subscription.view']);
    expect(labels()).toEqual(['Dashboard', 'Members', 'Periods', 'Lessons', 'Settings']);
  });
});
