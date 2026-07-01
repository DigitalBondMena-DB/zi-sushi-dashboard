import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { IGetComboOfferById } from "../../../../../../core/Interfaces/b-combo/IGetComboOfferById";

@Component({
  selector: "app-b-combo-boxes-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: "./b-combo-boxes-details.component.html",
  styleUrl: "./b-combo-boxes-details.component.scss",
})
export class BComboBoxesDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);

  comboOffers!: IGetComboOfferById;

  ngOnInit(): void {
    this.comboOffers = this.ActivatedRoute.snapshot.data["comboOffers"];
  }
}
