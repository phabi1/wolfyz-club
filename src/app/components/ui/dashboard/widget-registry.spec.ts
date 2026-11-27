import { TestBed } from '@angular/core/testing';

import { DASHBOARD_WIDGETS, provideDashboardWidgets } from './widget-registry';

describe('provideDashboardWidgets', () => {
  it('provides the widgets under DASHBOARD_WIDGETS', () => {
    const widgets = { stats: () => Promise.resolve(class {}) };

    TestBed.configureTestingModule({ providers: [provideDashboardWidgets(widgets)] });

    expect(TestBed.inject(DASHBOARD_WIDGETS)).toBe(widgets);
  });
});
