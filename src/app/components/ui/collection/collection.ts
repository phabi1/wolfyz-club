import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from '@angular/core';

export type CollectionLayout = 'grid' | 'list';

@Component({
  selector: 'app-ui-collection',
  imports: [NgTemplateOutlet],
  templateUrl: './collection.html',
  styleUrl: './collection.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Collection {
  readonly title = input.required<string>();
  readonly items = input.required<any[]>();
  readonly itemTpl = input.required<TemplateRef<any>>();
  readonly layout = input<CollectionLayout>('grid');
  readonly count = computed(() => this.items().length);
  readonly emptyMessage = input('Aucun élément');
  readonly sectionId = input('');
  readonly itemActions = input<any[]>([]);
  
  readonly addLabel = input('Ajouter');
  readonly removeLabel = input('Supprimer');

  readonly addItem = output<void>();
  readonly removeItem = output<{index: number}>();
  readonly itemClick = output<{index: number}>();
}
