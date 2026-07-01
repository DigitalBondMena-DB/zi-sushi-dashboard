import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-c-dashboard-menu",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./c-dashboard-menu.component.html",
  styleUrl: "./c-dashboard-menu.component.scss",
})
export class CDashboardMenuComponent {}
