import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideDashboardWidgets } from '../../components/ui/dashboard/widget-registry';
import { RootDashboard } from './dashboard';

describe('RootDashboard', () => {
  let component: RootDashboard;
  let fixture: ComponentFixture<RootDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RootDashboard],
    })
      // No widget: their lazy chunks would still be loading when the test ends.
      .overrideComponent(RootDashboard, { set: { providers: [provideDashboardWidgets({})] } })
      .compileComponents();

    fixture = TestBed.createComponent(RootDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
