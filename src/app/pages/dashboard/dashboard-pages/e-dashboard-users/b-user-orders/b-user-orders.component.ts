import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { TableModule } from "primeng/table";
import { IGetUserById, IUserOrders } from "../../../../../core/Interfaces/p-users/IGetUserById";
import { NoDataFoundBannerComponent } from "../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
@Component({
  selector: "app-b-user-orders",
  standalone: true,
  imports: [
    TableModule,
    FormsModule,
    DatePipe,
    ButtonModule,
    RouterLink,
    NoDataFoundBannerComponent,
    CurrencyPipe,
    LoadingDataBannerComponent,
  ],
  templateUrl: "./b-user-orders.component.html",
  styleUrl: "./b-user-orders.component.scss",
})
export class BUserOrdersComponent {
  userOrders: IUserOrders[] = [];

  userData!: IGetUserById;

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.userOrders = this.activatedRoute.snapshot.data["userData"].row.confirmed_orders;
    this.userData = this.activatedRoute.snapshot.data["userData"];
    console.log(this.userData);
    console.log(this.userData.row);
    console.log(this.userOrders);
  }
}
