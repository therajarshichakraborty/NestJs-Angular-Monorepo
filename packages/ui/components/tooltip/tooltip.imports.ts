import { OverlayModule } from '@angular/cdk/overlay';

import { ZardTooltipComponent, ZardTooltipDirective } from '@repo/ui/components/tooltip/tooltip';

export const ZardTooltipImports = [ZardTooltipComponent, ZardTooltipDirective, OverlayModule] as const;
