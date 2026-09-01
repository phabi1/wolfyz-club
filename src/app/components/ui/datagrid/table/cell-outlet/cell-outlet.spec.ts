import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CellOutlet } from './cell-outlet';

describe('CellOutlet', () => {
  let component: CellOutlet;
  let fixture: ComponentFixture<CellOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellOutlet],
    }).compileComponents();

    fixture = TestBed.createComponent(CellOutlet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
