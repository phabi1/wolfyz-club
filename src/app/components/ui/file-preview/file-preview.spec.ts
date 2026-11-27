import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreview } from './file-preview';
import { provideTestDefaults } from '../../../../testing/test-providers';

describe('FilePreview', () => {
  let component: FilePreview;
  let fixture: ComponentFixture<FilePreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilePreview],
      providers: [provideTestDefaults()],
    }).compileComponents();

    fixture = TestBed.createComponent(FilePreview);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('file', 'https://example.com/files/document.pdf');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
