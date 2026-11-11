import { ChangeDetectionStrategy, Component } from "@angular/core";

import { ZardButtonComponent } from "@repo/ui/components/button";
import { ZardFieldImports } from "@repo/ui/components/field";
import { ZardInputComponent } from "@repo/ui/components/input";

@Component({
  selector: "app-login",
  imports: [ZardButtonComponent, ZardInputComponent, ...ZardFieldImports],
  templateUrl: "./login.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "flex min-h-svh w-full items-center justify-center p-6 md:p-10",
  },
})
export class Login {}
