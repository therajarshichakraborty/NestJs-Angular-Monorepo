import { ZardCommandDividerComponent } from '@repo/ui/components/command/command-divider.component';
import { ZardCommandInputComponent } from '@repo/ui/components/command/command-input.component';
import { ZardCommandListComponent } from '@repo/ui/components/command/command-list.component';
import { ZardCommandOptionGroupComponent } from '@repo/ui/components/command/command-option-group.component';
import { ZardCommandOptionComponent } from '@repo/ui/components/command/command-option.component';
import { ZardCommandComponent } from '@repo/ui/components/command/command.component';

export const ZardCommandImports = [
  ZardCommandComponent,
  ZardCommandInputComponent,
  ZardCommandListComponent,
  ZardCommandOptionComponent,
  ZardCommandOptionGroupComponent,
  ZardCommandDividerComponent,
] as const;
