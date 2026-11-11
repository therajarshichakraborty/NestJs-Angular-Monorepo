import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    title: "Login",
    loadComponent: () => import("./pages/login/login").then((m) => m.Login),
  },
];
