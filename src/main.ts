import { bootstrapApplication } from '@angular/platform-browser';
import { setup } from './app/app.config';
import { App } from './app/app';

fetch('/config.json')
  .then((response) => response.json())
  .then((config) => bootstrapApplication(App, setup(config)))
  .catch((err) => console.error(err));
