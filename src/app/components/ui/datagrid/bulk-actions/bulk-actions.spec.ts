import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkActions } from './bulk-actions';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('BulkActions', () => {
  let component: BulkActions;
  let fixture: ComponentFixture<BulkActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkActions],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(BulkActions);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('selectedRows', { reverse: false, ids: [] });
    fixture.componentRef.setInput('total', 0);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
