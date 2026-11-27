import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Text } from './text';
import { provideTestDefaults } from '../../../../../../../testing/test-providers';

describe('Text', () => {
  let component: Text;
  let fixture: ComponentFixture<Text>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Text],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(Text);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('name', 'text');
    fixture.componentRef.setInput('label', 'Text');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
