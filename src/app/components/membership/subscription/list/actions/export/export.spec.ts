import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SubscriptionExportService } from '../../../../../../services/membership/subscription-export.service';

import { Export } from './export';

describe('Export', () => {
  let component: Export;
  let fixture: ComponentFixture<Export>;
  let exportService: jasmine.SpyObj<SubscriptionExportService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<Export>>;
  let dialogData: { campaignId: string | null; ids: string[]; reverse: boolean };

  beforeEach(async () => {
    dialogData = { campaignId: '42', ids: ['1', '2'], reverse: false };
    exportService = jasmine.createSpyObj<SubscriptionExportService>(
      'SubscriptionExportService',
      ['export', 'download'],
    );
    exportService.export.and.returnValue(
      of({ blob: new Blob(['export']), fileName: 'subscriptions.csv' }),
    );
    dialogRef = jasmine.createSpyObj<MatDialogRef<Export>>('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [Export],
      providers: [
        { provide: SubscriptionExportService, useValue: exportService },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: dialogData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Export);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('exports the selected subscriptions and downloads the returned file', () => {
    fixture.detectChanges();

    expect(exportService.export).toHaveBeenCalledOnceWith('42', {
      ids: ['1', '2'],
      reverse: false,
    });
    expect(exportService.download).toHaveBeenCalledOnceWith({
      blob: jasmine.any(Blob),
      fileName: 'subscriptions.csv',
    });
    expect(dialogRef.close).toHaveBeenCalledOnceWith(true);
    expect(component.isGenerating).toBeFalse();
  });

  it('shows an error when no campaign is selected', () => {
    dialogData.campaignId = null;
    fixture.detectChanges();

    expect(exportService.export).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Aucune campagne sélectionnée.');
    expect(component.isGenerating).toBeFalse();
  });
});
