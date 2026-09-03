import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostingLine } from './line';

describe('GhostingLine', () => {
  let component: GhostingLine;
  let fixture: ComponentFixture<GhostingLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostingLine],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostingLine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
