import { ZardContextMenuDirective } from "@repo/ui/components/context-menu/context-menu.directive";
import { ZardDropdownMenuItemComponent } from "@repo/ui/components/dropdown/dropdown-item.component";
import { ZardDropdownMenuContentComponent } from "@repo/ui/components/dropdown/dropdown-menu-content.component";
import {
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
} from "@repo/ui/components/dropdown/dropdown-primitives.component";
import {
  ZardDropdownMenuSubContentComponent,
  ZardDropdownMenuSubTriggerComponent,
} from "@repo/ui/components/dropdown/dropdown-submenu.component";

/** The trigger plus every menu primitive the content is built from. */
export const ZardContextMenuImports = [
  ZardContextMenuDirective,
  ZardDropdownMenuContentComponent,
  ZardDropdownMenuItemComponent,
  ZardDropdownMenuGroupComponent,
  ZardDropdownMenuLabelComponent,
  ZardDropdownMenuSeparatorComponent,
  ZardDropdownMenuShortcutComponent,
  ZardDropdownMenuCheckboxItemComponent,
  ZardDropdownMenuRadioGroupComponent,
  ZardDropdownMenuRadioItemComponent,
  ZardDropdownMenuSubTriggerComponent,
  ZardDropdownMenuSubContentComponent,
] as const;
