import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, TemplateRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

export type CollectionLayout = 'grid' | 'list';

export type CollectionItemAction = {
  label: string;
  handler: (event: { item: any; index: number }) => void;
};

@Component({
  selector: 'app-ui-collection',
  imports: [NgTemplateOutlet, MatButtonModule, MatIcon, MatMenuModule],
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
  readonly itemActions = input<CollectionItemAction[]>([]);
  
  readonly addLabel = input('Ajouter');
  readonly removeLabel = input('Supprimer');

  readonly addItem = output<void>();
  readonly itemClick = output<{ item: any; index: number }>();
}
