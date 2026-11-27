import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Group } from './group';
import { provideTestDefaults } from '../../../../../testing/test-providers';

describe('Group', () => {
  let component: Group;
  let fixture: ComponentFixture<Group>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Group],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Group);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', { type: 'group', label: 'Group', children: [] });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
