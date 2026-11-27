import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellOutlet } from './cell-outlet';
import { provideTestDefaults } from '../../../../../../testing/test-providers';

describe('CellOutlet', () => {
  let component: CellOutlet;
  let fixture: ComponentFixture<CellOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellOutlet],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(CellOutlet);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('row', {});
    fixture.componentRef.setInput('column', { name: 'name', header: 'Name' });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
