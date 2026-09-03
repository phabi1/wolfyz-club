import { NgComponentOutlet } from '@angular/common';
import { Component, computed, effect, inject, input, signal, Type } from '@angular/core';
import { DATAGRID_CELLS } from '../../provider';
import { Cell } from '../../cell';

@Component({
  selector: 'app-ui-datagrid-table-cell-outlet',
  imports: [NgComponentOutlet],
  templateUrl: './cell-outlet.html',
  styleUrl: './cell-outlet.css',
})
export class CellOutlet {
  cells = inject(DATAGRID_CELLS);
  row = input.required<any>();
  column = input.required<any>();

  cmp = signal<Type<Cell> | null>(null);

  value = computed(() => {
    const column = this.column();

    const prop = column.data || column.name;
    const segments = prop.split('.');
    let value = this.row();
    for (const segment of segments) {
      value = value?.[segment];
    }
    return value;
  });

  cell = computed(() => {
    const column = this.column();
    let type = 'text';
    let options = {};

    if (column.cell) {
      if (typeof column.cell === 'string') {
        type = column.cell;
      } else if (typeof column.cell === 'object' && column.cell.type) {
        type = column.cell.type;
      }
    } else if (column.type) {
      type = column.type;
    }
    return { type, options };
  });
  cellInputs = signal<any>({});

  constructor() {
    effect(async () => {
      const { type } = this.cell();
      const fn = this.cells[type];
      this.cmp.set(fn ? await fn() : null);
    });

    effect(() => {
      const { options } = this.cell();
      this.cellInputs.set({ value: this.value(), ...options });
    });
  }
}
