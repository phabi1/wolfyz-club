import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestDefaults } from '../../../../../testing/test-providers';
import { provideDashboardWidgets } from '../../../../components/ui/dashboard/widget-registry';
import { CampaignDashboard } from './dashboard';

describe('CampaignDashboard', () => {
  let component: CampaignDashboard;
  let fixture: ComponentFixture<CampaignDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignDashboard],
      providers: [provideTestDefaults()],
    })
      // No widget: their lazy chunks would still be loading when the test ends.
      .overrideComponent(CampaignDashboard, { set: { providers: [provideDashboardWidgets({})] } })
      .compileComponents();

    fixture = TestBed.createComponent(CampaignDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
