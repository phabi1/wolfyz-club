import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { catchError, map, of, switchMap } from 'rxjs';
import { BitesPipe } from '../../../../pipes/bites-pipe';
import { ConfigService } from '../../../../services/config.service';

type UploadProps = {
  label: string;
  uploadUrl: string;
  removeUrl: string;
  allowedTypes: string[];
  maxFileSize?: number;
};

@Component({
  selector: 'app-form-field-upload',
  imports: [NgClass, MatButtonModule, MatIconModule, BitesPipe],
  templateUrl: './upload.html',
  styleUrls: ['./upload.css'],
})
export class UploadFieldType extends FieldType<FieldTypeConfig<UploadProps>> {
  readonly configService = inject(ConfigService);
  readonly httpClient = inject(HttpClient);
  readonly dragging = signal<boolean>(false);
  readonly uploading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  override defaultOptions = {
    props: {
      label: '',
      uploadUrl: '',
      removeUrl: '',
      allowedTypes: [],
      maxFileSize: 10485760 / 2, // 5 MB
    },
  };

  filename = signal<string | null>(null);

  filetype = computed(() => {
    const value = this.field.formControl.value;
    if (!value) {
      return null;
    }
    const filename = value.substring(value.lastIndexOf('/') + 1);
    const extension = filename ? filename.split('.').pop() || null : null;
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      case 'pdf':
        return 'pdf';
      default:
        return 'file';
    }
  });

  isExternal = computed(() => {
    const value = this.field.formControl.value;
    if (!value) {
      return false;
    }
    return value ? value.startsWith('http://') || value.startsWith('https://') : false;
  });

  constructor() {
    super();
    effect(() => {
      const value = this.field.formControl.value;
      if (!value) {
        this.filename.set(null);
      } else {
        this.filename.set(value.substring(value.lastIndexOf('/') + 1));
      }
      const subscription = this.field.formControl.valueChanges.subscribe((value) => {
        if (!value) {
          this.filename.set(null);
        } else {
          this.filename.set(value.substring(value.lastIndexOf('/') + 1));
        }
      });
      return () => subscription.unsubscribe();
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  onDropped(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.uploadFile(files[0]);
    }
  }

  onRemoveFile(): void {
    if (this.isExternal()) {
      this.field.formControl.setValue(null);
    } else {
      this.httpClient
        .post(this.configService.get('api.endpoint') + this.props.removeUrl, {
          file: this.field.formControl.value,
        })
        .pipe(
          switchMap((res: any) =>
            this.httpClient.delete(res.url, {
              body: {
                file: this.field.formControl.value,
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }).pipe(catchError((err) => of(null))),
          ),
        )
        .subscribe(() => {
          this.field.formControl.setValue(null);
        });
    }
  }

  private uploadFile(file: File): void {
    this.uploading.set(true);
    this.error.set(null);
    this.httpClient
      .post(this.configService.get('api.endpoint') + this.props.uploadUrl, {
        file: file.name,
        mime_type: file.type,
      })
      .pipe(
        switchMap((res: any) =>
          this.httpClient
            .put(res.url, file, {
              headers: {
                'Content-Type': file.type,
              },
            })
            .pipe(
              map(() => {
                const url = new URL(res.url);
                const queryParams = new URLSearchParams(url.search);
                return queryParams.get('file');
              }),
            ),
        ),
      )
      .subscribe({
        next: (file) => {
          this.uploading.set(false);
          this.error.set(null);
          this.field.formControl.setValue(file);
        },
        error: (err) => {
          this.uploading.set(false);
          this.error.set(err.message || 'Upload failed');
        },
      });
  }
}
