import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { IGetSubLocationById } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationById";
import { IBranch, ILocation } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationsBranches";

@Component({
  selector: "app-b-sub-locations-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink, CurrencyPipe],
  templateUrl: "./b-sub-locations-details.component.html",
  styleUrl: "./b-sub-locations-details.component.scss",
})
export class BSubLocationsDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);
  Branches: IBranch[] = [];
  Locations: ILocation[] = [];

  subLocationData!: IGetSubLocationById;

  ngOnInit(): void {
    this.subLocationData = this.ActivatedRoute.snapshot.data["subLocations"];
    this.Branches = this.ActivatedRoute.snapshot.data["subLocations"].branches;
    this.Locations = this.ActivatedRoute.snapshot.data["subLocations"].locations;
  }

  findCity(id: number): string | undefined {
    return this.Branches.find((e) => e.id === id)?.en_branch_location;
  }

  findLocations(id: number): string | undefined {
    return this.Locations.find((e) => e.id === id)?.en_location;
  }
}
