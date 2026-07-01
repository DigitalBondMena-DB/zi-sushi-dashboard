import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-b-products",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./b-products.component.html",
  styleUrl: "./b-products.component.scss",
})
export class BProductsComponent {}
