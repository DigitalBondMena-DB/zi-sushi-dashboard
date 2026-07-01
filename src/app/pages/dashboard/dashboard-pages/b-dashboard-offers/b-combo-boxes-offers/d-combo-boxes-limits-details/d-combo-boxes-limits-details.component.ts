import { Combo } from './../../../../../../core/Interfaces/b-combo/IToggleComboOffer';
import { PiecesPrice } from './../../../../../../core/Interfaces/d-products/IGetProductById';
import { DatePipe } from "@angular/common";
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
import { IGetComboOfferById, Limit } from "../../../../../../core/Interfaces/b-combo/IGetComboOfferById";
import { ProductsPieces } from "../../../../../../core/Interfaces/d-products/IGetAllProducts";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { Category } from "../../../../../../core/Interfaces/h-category/ICategoryById";
import { ComboService } from "../../../../../../core/services/b-combo/combo.service";
import { Product } from "../../../../../../core/Interfaces/b-combo/IGetAllComboProducts";

@Component({
  selector: "app-d-combo-boxes-limits-details",
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
  templateUrl: "./d-combo-boxes-limits-details.component.html",
  styleUrl: "./d-combo-boxes-limits-details.component.scss",
  providers: [MessageService],
})
export class DComboBoxesLimitsDetailsComponent {
  limits!: Limit[];

  combo!: IGetComboOfferById;

  categories!: Category[];

  products!: Product[];

  private activatedRoute = inject(ActivatedRoute);

  private route = inject(Router);

  private comboService = inject(ComboService);

  loading = false;

  private messageService = inject(MessageService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  ngOnInit(): void {
    this.products = this.activatedRoute.snapshot.data["products"].products;
    console.log(this.activatedRoute.snapshot.data["products"]);
    console.log(this.products);
    this.loadLimits();
  }

  loadLimits(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.comboService.getComboOfferById(params.get("id")!).subscribe({
        next: (products) => {
          this.categories = this.activatedRoute.snapshot.data["category"].categories;
          this.limits = products.combo.limits;
          this.combo = products;
          console.log(products);
        },
      });
    });
  }

  editPicePrice(picePrice: ProductsPieces) {
    localStorage.setItem("combo", JSON.stringify(picePrice));
    console.log("picePrice",picePrice);
    this.route.navigate([`/dashboard/offers/combo/limits-edit/${this.combo.combo.id}`]);
  }

  getCategory(id: number): string | undefined {
    return this.categories.find((e) => e.id === id)?.en_name;
  }

  deleteLimit(limit: Limit) {
    this.ngxSpinnerService.show("actionsLoader");

    this.comboService
      .updateLimit(limit.id.toString(), {
        combo_id: limit.combo_id,
        category_id: limit.category_id,
        limit_count: 0,
      })
      .subscribe((response) => {
        this.removeLimit(limit.id);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Combo updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
  }

  removeLimit(limitId: number) {
    this.limits = this.limits.filter((limit) => limit.id !== limitId);
  }
}




