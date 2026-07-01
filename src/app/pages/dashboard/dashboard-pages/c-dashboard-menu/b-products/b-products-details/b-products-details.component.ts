import { CommonModule, CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { IGetProductById } from "../../../../../../core/Interfaces/d-products/IGetProductById";
import {  WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-b-products-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink, NgOptimizedImage, CurrencyPipe],
  templateUrl: "./b-products-details.component.html",
  styleUrl: "./b-products-details.component.scss",
})
export class BProductsDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);
  readonly imgUrl = WEB_SITE_IMG_URL;
  productData!: IGetProductById;

  ngOnInit(): void {
    this.productData = this.ActivatedRoute.snapshot.data["products"];
  }
}
