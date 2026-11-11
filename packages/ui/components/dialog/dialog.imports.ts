import {
  ZardDialogCloseDirective,
  ZardDialogComponent,
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
} from "@repo/ui/components/dialog/dialog.component";

/** Every part of the declarative dialog, for a template that composes one. */
export const ZardDialogImports = [
  ZardDialogComponent,
  ZardDialogHeaderComponent,
  ZardDialogTitleComponent,
  ZardDialogDescriptionComponent,
  ZardDialogFooterComponent,
  ZardDialogCloseDirective,
] as const;
