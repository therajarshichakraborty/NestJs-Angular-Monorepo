import { ZardChartLegendComponent } from "@repo/ui/components/chart/chart-legend.component";
import { ZardChartTooltipComponent } from "@repo/ui/components/chart/chart-tooltip.component";
import { ZardChartComponent } from "@repo/ui/components/chart/chart.component";

export const ZardChartImports = [
  ZardChartComponent,
  ZardChartTooltipComponent,
  ZardChartLegendComponent,
] as const;
