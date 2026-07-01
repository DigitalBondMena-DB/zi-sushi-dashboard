import { Component, inject } from "@angular/core";
import { DashboardFooterComponent } from "../../dashboard-footer/dashboard-footer.component";
import { DashboardTopBarComponent } from "../../dashboard-top-bar/dashboard-top-bar.component";
import { RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-j-internet-connection",
  standalone: true,
  imports: [DashboardFooterComponent, DashboardTopBarComponent, RouterLink],
  templateUrl: "./j-internet-connection.component.html",
  styleUrl: "./j-internet-connection.component.scss",
})
export class JInternetConnectionComponent {
  private readonly ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit() {
    this.ngxSpinnerService.hide("actionsLoader");
    const img = new Image();
    img.src = "./assets/no-internet.png"; // Preload the image
  }
}
