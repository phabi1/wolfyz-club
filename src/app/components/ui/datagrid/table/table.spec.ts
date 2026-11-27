import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Table } from './table';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('Table', () => {
  let component: Table;
  let fixture: ComponentFixture<Table>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Table);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('actions', []);
    fixture.componentRef.setInput('bulkActions', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
