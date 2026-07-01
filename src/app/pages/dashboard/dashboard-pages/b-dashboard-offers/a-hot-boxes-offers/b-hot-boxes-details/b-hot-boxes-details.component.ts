import { CommonModule, CurrencyPipe, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { IGetBoxById } from "../../../../../../core/Interfaces/c-hot-boxes/IGetBoxById";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-b-hot-boxes-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink, NgOptimizedImage, CurrencyPipe],
  templateUrl: "./b-hot-boxes-details.component.html",
  styleUrl: "./b-hot-boxes-details.component.scss",
})
export class BHotBoxesDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);

  boxData!: IGetBoxById;
  readonly imgUrl = WEB_SITE_IMG_URL;
  ngOnInit(): void {
    this.boxData = this.ActivatedRoute.snapshot.data["boxes"];
  }
}
