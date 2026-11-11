import { ZardContextMenuDirective } from "@repo/ui/components/navigation-menu/context-menu.directive";
import { ZardNavigationMenuContentDirective } from "@repo/ui/components/navigation-menu/navigation-menu-content.directive";
import { ZardNavigationMenuIndicatorComponent } from "@repo/ui/components/navigation-menu/navigation-menu-indicator.component";
import { ZardNavigationMenuItemDirective } from "@repo/ui/components/navigation-menu/navigation-menu-item.directive";
import { ZardNavigationMenuLabelComponent } from "@repo/ui/components/navigation-menu/navigation-menu-label.component";
import { ZardNavigationMenuLinkDirective } from "@repo/ui/components/navigation-menu/navigation-menu-link.directive";
import { ZardNavigationMenuListDirective } from "@repo/ui/components/navigation-menu/navigation-menu-list.directive";
import { ZardNavigationMenuShortcutComponent } from "@repo/ui/components/navigation-menu/navigation-menu-shortcut.component";
import { ZardNavigationMenuTriggerDirective } from "@repo/ui/components/navigation-menu/navigation-menu-trigger.directive";
import { ZardNavigationMenuViewportComponent } from "@repo/ui/components/navigation-menu/navigation-menu-viewport.component";
import { ZardNavigationMenuComponent } from "@repo/ui/components/navigation-menu/navigation-menu.component";

export const ZardNavigationMenuImports = [
  ZardNavigationMenuComponent,
  ZardNavigationMenuListDirective,
  ZardNavigationMenuItemDirective,
  ZardNavigationMenuTriggerDirective,
  ZardNavigationMenuContentDirective,
  ZardNavigationMenuLinkDirective,
  ZardNavigationMenuIndicatorComponent,
  ZardNavigationMenuViewportComponent,
  ZardNavigationMenuLabelComponent,
  ZardNavigationMenuShortcutComponent,
  ZardContextMenuDirective,
] as const;
