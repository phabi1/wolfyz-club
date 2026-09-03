import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-ui-datagrid-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
})
export class Pagination {
  count = input<number>(0);
  total = input<number>(0);
  currentPage = input<number>(1);
  size = input<number>(10);
  maxVisiblePages = input<number>(5);

  pages = computed(() => {
    const totalPages = Math.ceil(this.total() / this.size());
    const visiblePages = Math.min(this.maxVisiblePages(), totalPages);
    const startPage = Math.max(1, this.currentPage() - Math.floor(visiblePages / 2));
    const endPage = Math.min(totalPages, startPage + visiblePages - 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  });

  pagignationChange = output<{page: number, size: number}>();

  onFirstPage() {
    this.pagignationChange.emit({ page: 1, size: this.size() });
  }
  
  onPreviousPage() {
    this.pagignationChange.emit({ page: Math.max(1, this.currentPage() - 1), size: this.size() });
  }

  onNextPage() {
    this.pagignationChange.emit({ page: this.currentPage() + 1, size: this.size() });
  }

  onLastPage() {
    const totalPages = Math.ceil(this.total() / this.size());
    this.pagignationChange.emit({ page: totalPages, size: this.size() });
  }

  onPage(page: number) {
    this.pagignationChange.emit({ page, size: this.size() });
  }
}
