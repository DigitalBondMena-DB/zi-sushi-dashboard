import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
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
import { IGetProductById, PiecesPrice } from "../../../../../../core/Interfaces/d-products/IGetProductById";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";

@Component({
  selector: "app-d-products-pice-price",
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
    CurrencyPipe,
    DatePipe,
    NoDataFoundBannerComponent,
    LoadingDataBannerComponent,
  ],
  templateUrl: "./d-products-pice-price.component.html",
  styleUrl: "./d-products-pice-price.component.scss",
  providers: [MessageService],
})
export class DProductsPicePriceComponent {
  picePrices!: PiecesPrice[];

  product!: IGetProductById;

  private activatedRoute = inject(ActivatedRoute);

  private route = inject(Router);

  loading = false;

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private productsService = inject(ProductsService);

  ngOnInit(): void {
    this.loadPiecesPrices();
  }

  loadPiecesPrices(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.productsService.getProductById(params.get("id")!).subscribe({
        next: (products) => {
          console.log(products);
          this.picePrices = products.piecesPrices;
          this.product = products;
        },
      });
    });
  }

  // Toggle Product
  toggleProductStatus(picePrice: ProductsPieces) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = picePrice.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.productsService
        .updateProductPics(picePrice.id.toString(), {
          pieces: picePrice.prices,
          prices: picePrice.prices,
          status: 1,
        })
        .subscribe(() => {
          picePrice.status = updatedStatus; // Update the UI immediately
          this.messageService.add({
            severity: "success",
            summary: "Updated",
            detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
          });
          timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
        });
    } else {
      this.productsService
        .updateProductPics(picePrice.id.toString(), {
          pieces: picePrice.prices,
          prices: picePrice.prices,
          status: 0,
        })
        .subscribe(() => {
          picePrice.status = updatedStatus; // Update the UI immediately
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
    localStorage.setItem("PiceDetails", JSON.stringify(picePrice));
    this.route.navigate([`/dashboard/menu/products/products-pice-price-edit/${this.product.product.id}`]);
  }
}
