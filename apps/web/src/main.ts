import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

// eslint-disable-next-line no-console -- surface fatal bootstrap errors in the browser console
bootstrapApplication(App, appConfig).catch((err: unknown) => console.error(err));
