import { ZardInputOtpGroupComponent } from "@repo/ui/components/input-otp/input-otp-group.component";
import { ZardInputOtpSeparatorComponent } from "@repo/ui/components/input-otp/input-otp-separator.component";
import { ZardInputOtpSignalComponent } from "@repo/ui/components/input-otp/input-otp-signal.component";
import { ZardInputOtpSlotComponent } from "@repo/ui/components/input-otp/input-otp-slot.component";
import { ZardInputOtpComponent } from "@repo/ui/components/input-otp/input-otp.component";

export const ZardInputOtpImports = [
  ZardInputOtpComponent,
  ZardInputOtpSignalComponent,
  ZardInputOtpGroupComponent,
  ZardInputOtpSlotComponent,
  ZardInputOtpSeparatorComponent,
] as const;
