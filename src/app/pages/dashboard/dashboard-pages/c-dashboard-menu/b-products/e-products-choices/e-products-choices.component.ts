import { DatePipe } from "@angular/common";
import { Component, inject, SimpleChanges } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouteReuseStrategy, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { ProductsPieces } from "../../../../../../core/Interfaces/d-products/IGetAllProducts";
import { Choice, IGetProductById } from "../../../../../../core/Interfaces/d-products/IGetProductById";
import { productDetailsResolver } from "../../../../../../core/resolvers/d-products/product-details.resolver";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";

@Component({
  selector: "app-e-products-choices",
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    InputSwitchModule,
    RouterLink,
    DatePipe,
    NoDataFoundBannerComponent,
    LoadingDataBannerComponent,
  ],
  templateUrl: "./e-products-choices.component.html",
  styleUrl: "./e-products-choices.component.scss",
  providers: [MessageService],
})
export class EProductsChoicesComponent {
  choices!: Choice[];

  product!: IGetProductById;

  private activatedRoute = inject(ActivatedRoute);

  private route = inject(Router);

  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.loadChoices();
  }

  loadChoices(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.productsService.getProductById(params.get("id")!).subscribe({
        next: (products) => {
          console.log(products);
          this.choices = products.choices;
          this.product = products;
        },
      });
    });
  }

  // Toggle Product
  toggleProductStatus(choices: Choice) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = choices.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.productsService
        .updateProductChoices(choices.id.toString(), {
          pieces: choices.en_name,
          prices: choices.ar_name,
          status: 1,
        })
        .subscribe(() => {
          choices.status = updatedStatus; // Update the UI immediately
          this.messageService.add({
            severity: "success",
            summary: "Updated",
            detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
          });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        });
    } else {
      this.productsService
        .updateProductChoices(choices.id.toString(), {
          pieces: choices.en_name,
          prices: choices.ar_name,
          status: 0,
        })
        .subscribe(() => {
          choices.status = updatedStatus; // Update the UI immediately
          this.messageService.add({
            severity: "success",
            summary: "Updated",
            detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
          });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        });
    }
  }

  editPicePrice(picePrice: ProductsPieces) {
    localStorage.setItem("choices", JSON.stringify(picePrice));
    this.route.navigate([`/dashboard/menu/products/products-choice-edit/${this.product.product.id}`]);
  }
}
