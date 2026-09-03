import { InjectionToken, Type } from '@angular/core';
import { Cell } from './cell';

export const DATAGRID_CELLS = new InjectionToken<Record<string, () => Promise<Type<Cell>>>>(
  'DATAGRID_CELLS',
);

export function provideDatagrid(cells: Record<string, () => Promise<Type<Cell>>>) {
  const defaultCells = {
    text: () => import('./table/cell/text/text').then((m) => m.Text),
    number: () => import('./table/cell/number/number').then((m) => m.Number),
    date: () => import('./table/cell/date/date').then((m) => m.DateCell),
    'date-ago': () => import('./table/cell/date-ago/date-ago').then((m) => m.DateAgo),
  };

  return [
    {
      provide: DATAGRID_CELLS,
      useValue: { ...defaultCells, ...cells },
    },
  ];
}
