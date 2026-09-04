import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Collection } from './collection';

@Component({
  imports: [Collection],
  template: `
    <app-ui-collection
      [title]="'Test'"
      [layout]="layout"
      [emptyMessage]="'Aucun element'"
      [items]="items"
      [itemTpl]="itemTpl"
    ></app-ui-collection>

    <ng-template #itemTpl let-item>
      <p>{{ item }}</p>
    </ng-template>
  `,
})
class HostComponent {
  items = ['A'];
  layout: 'grid' | 'list' = 'grid';
}

describe('Collection', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render list layout when requested', () => {
    component.layout = 'list';
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.collection-items');
    expect(container.classList.contains('collection-items-list')).toBeTrue();
  });
});
