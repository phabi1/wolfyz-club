import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostingRectangle } from './rectangle';

describe('GhostingRectangle', () => {
  let component: GhostingRectangle;
  let fixture: ComponentFixture<GhostingRectangle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostingRectangle],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostingRectangle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
