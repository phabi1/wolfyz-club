import { Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ui-file-preview',
  imports: [MatIconModule],
  templateUrl: './file-preview.html',
  styleUrl: './file-preview.css',
})
export class FilePreview {
  file = input.required<string>();

  filetype = computed(() => {
    const file = this.file();
    const extension = file.substring(file.lastIndexOf('.'));
    if (this.isImage(extension)) {
      return 'image';
    } else if (this.isPdf(extension)) {
      return 'pdf';
    }
    return 'file';
  });

  filename = computed(() => {
    const file = this.file();
    return file.substring(file.lastIndexOf('/') + 1);
  });

  url = computed(() => this.file());

  private isImage(extension: string): boolean {
    return ['jpg', 'jpeg,', 'gif', 'png', 'avif', 'heic', 'webp'].includes(extension);
  }

  private isPdf(extension: string): boolean {
    return extension === 'pdf';
  }
}
