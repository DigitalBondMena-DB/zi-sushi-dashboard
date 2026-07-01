import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { ILocation } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationsBranches";
import { IGetUserById, IUSerAddress } from "../../../../../core/Interfaces/p-users/IGetUserById";
import { NoDataFoundBannerComponent } from "../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
@Component({
  selector: "app-c-user-addresses",
  standalone: true,
  imports: [TableModule, DatePipe, ButtonModule, RouterLink, NoDataFoundBannerComponent],
  templateUrl: "./c-user-addresses.component.html",
  styleUrl: "./c-user-addresses.component.scss",
})
export class CUserAddressesComponent {
  userAddresses: IUSerAddress[] = [];

  userData!: IGetUserById;

  Locations: ILocation[] = [];

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.userAddresses = this.activatedRoute.snapshot.data["userData"].row.addresses;
    this.userData = this.activatedRoute.snapshot.data["userData"];
    const LocationsData = this.activatedRoute.snapshot.data["LocationsData"];
    this.Locations = LocationsData.locations;
  }

  findLocations(id: number): string | undefined {
    return this.Locations.find((e) => e.id === id)?.en_location;
  }
}
