import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GhostingCircle } from './circle';

describe('GhostingCircle', () => {
  let component: GhostingCircle;
  let fixture: ComponentFixture<GhostingCircle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GhostingCircle],
    }).compileComponents();

    fixture = TestBed.createComponent(GhostingCircle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
