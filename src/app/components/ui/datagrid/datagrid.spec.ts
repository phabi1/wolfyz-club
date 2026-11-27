import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Datagrid } from './datagrid';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('Datagrid', () => {
  let component: Datagrid;
  let fixture: ComponentFixture<Datagrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datagrid],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Datagrid);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('rows', []);
    fixture.componentRef.setInput('total', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
