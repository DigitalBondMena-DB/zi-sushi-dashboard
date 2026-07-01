import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-c-tutorial",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./c-tutorial.component.html",
  styleUrl: "./c-tutorial.component.scss",
})
export class CTutorialComponent {}
