import { makeEnvironmentProviders } from '@angular/core';

export class ConfigService {
  private settings: Record<string, any> = {};

  load(config: any) {
    this.settings = config;
  }

  get(key: string, defaultValue: any = null) {
    const segments = key.split('.');
    let value = this.settings;
    for (const segment of segments) {
      if (value[segment] === undefined) {
        return defaultValue;
      }
      value = value[segment];
    }
    return value;
  }
}

export function provideConfig(config: any) {
  const configService = new ConfigService();
  configService.load(config);
  return makeEnvironmentProviders([
    {
      provide: ConfigService,
      useValue: configService,
    },
  ]);
}
