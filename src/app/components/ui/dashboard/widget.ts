import { GridsterItemConfig } from 'angular-gridster2';

export type Widget = GridsterItemConfig & { type: string; settings: Record<string, any> };
