import { Injectable, InjectionToken } from '@angular/core';

export const DASHBOARD_WIDGETS = new InjectionToken<Record<string, () => Promise<any>>>(
  'dashboard.widgets',
);

export function provideDashboardWidgets(widgets: Record<string, () => Promise<any>>) {
  return [
    {
      provide: DASHBOARD_WIDGETS,
      useValue: widgets,
    },
  ];
}
