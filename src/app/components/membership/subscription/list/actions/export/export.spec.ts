import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { type Mock, vi } from 'vitest';
import { SubscriptionExportService } from '../../../../../../services/membership/subscription-export.service';

import { Export } from './export';

describe('Export', () => {
  let component: Export;
  let fixture: ComponentFixture<Export>;
  let exportService: { export: Mock; download: Mock };
  let dialogRef: { close: Mock };
  let dialogData: { campaignId: string | null; ids: string[]; reverse: boolean };

  beforeEach(async () => {
    dialogData = { campaignId: '42', ids: ['1', '2'], reverse: false };
    exportService = {
      export: vi.fn().mockReturnValue(of({ blob: new Blob(['export']), fileName: 'subscriptions.csv' })),
      download: vi.fn(),
    };
    dialogRef = { close: vi.fn() };

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

    expect(exportService.export).toHaveBeenCalledExactlyOnceWith('42', {
      ids: ['1', '2'],
      reverse: false,
    });
    expect(exportService.download).toHaveBeenCalledExactlyOnceWith({
      blob: expect.any(Blob),
      fileName: 'subscriptions.csv',
    });
    expect(dialogRef.close).toHaveBeenCalledExactlyOnceWith(true);
    expect(component.isGenerating).toBe(false);
  });

  it('shows an error when no campaign is selected', () => {
    dialogData.campaignId = null;
    fixture.detectChanges();

    expect(exportService.export).not.toHaveBeenCalled();
    expect(component.errorMessage).toBe('Aucune campagne sélectionnée.');
    expect(component.isGenerating).toBe(false);
  });
});
