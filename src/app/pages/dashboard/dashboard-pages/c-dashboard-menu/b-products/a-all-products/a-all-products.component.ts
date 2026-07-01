import { NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { InputSwitchModule } from "primeng/inputswitch";
import { Table, TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { timer } from "rxjs";
import { IGetAllProducts, productsData } from "../../../../../../core/Interfaces/d-products/IGetAllProducts";
import { ProductsService } from "../../../../../../core/services/d-products/products.service";
import { LoadingDataBannerComponent } from "../../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { NoDataFoundBannerComponent } from "../../../../../../shared/components/no-data-found-banner/no-data-found-banner.component";
import { ISelectOptions } from "../../../../../../core/Interfaces/core/ISelectOptions";
import { IGetProductsCategories } from "../../../../../../core/Interfaces/d-products/IGetProductsCategories";
import { WEB_SITE_IMG_URL } from "../../../../../../core/constants/WEB_SITE_BASE_UTL";

@Component({
  selector: "app-a-all-products",
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
    LoadingDataBannerComponent,
    RouterLink,
    NgOptimizedImage,
    NoDataFoundBannerComponent,
  ],
  templateUrl: "./a-all-products.component.html",
  styleUrl: "./a-all-products.component.scss",
  providers: [MessageService],
})
export class AAllProductsComponent {
  products: productsData[] = [];
  allCategories!: IGetProductsCategories;
  filteredProducts: productsData[] = [];
  categoryData!: {
    value: number;
    label: string;
  }[];
  allProducts!: IGetAllProducts;
  readonly imgUrl = WEB_SITE_IMG_URL;
  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private productsService = inject(ProductsService);

  // Dropdown
  selectedStatus: string = "";
  selectOptions: ISelectOptions[] = [];
  onFilterCategoryChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredProducts = this.products.filter((ele) => {
        return ele.category.en_name.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredProducts = [...this.products];
    }
  }
  onFilterChange(value: string): void {
    if (value) {
      // Filter the blogs based on the selected category
      this.filteredProducts = this.products.filter((ele) => {
        return ele.status.toString().includes(value);
      });
    } else {
      // Reset to original data if no category is selected
      this.filteredProducts = [...this.products];
    }
  }

  initDropDownFilter(): void {
    this.selectOptions = [
      {
        label: "Active",
        value: "1",
      },
      {
        label: "Inactive",
        value: "0",
      },
    ];
  }

  ngOnInit() {
    this.initDropDownFilter();
    this.initCategories();
    this.fetchData();
  }

  // get all categories
  initCategories(): void {
    this.productsService.getAllProductsCategories().subscribe((response) => {
      this.allCategories = response;
      this.categoryData = this.allCategories.categories.map((category) => ({
        value: category.id,
        label: category.en_name,
      }));
    });
  }

  // get All Product
  fetchData() {
    this.productsService.getAllProducts().subscribe(
      (response) => {
        // response.products.data.reverse();
        this.allProducts = response;
        this.totalRecords = response.products.total;
        this.products = response.products.data;
        this.filteredProducts = [...this.products];
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Product" });
      }
    );
  }

  // Toggle Product
  toggleProductStatus(Product: productsData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = Product.status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.productsService.enableProduct(Product.id.toString()).subscribe(() => {
        Product.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.productsService.destroyProduct(Product.id.toString()).subscribe(() => {
        Product.status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `Product ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Convert to 1-based index
    this.rowsPerPage = event.rows;
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  loadProducts(page: number, perPage: number) {
    this.ngxSpinnerService.show("actionsLoader");
    this.productsService.getAllProducts(page, perPage).subscribe(
      (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.allProducts = response;
        this.totalRecords = response.products.total;
        this.products = response.products.data;
        this.filteredProducts = [...this.products];
      },
      () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load Product" });
      }
    );
  }

  getPagination(): number[] {
    if (this.totalRecords === 0) return [0];

    const options = [10, 100, 500, 1000];
    const validOptions = options.filter((opt) => opt <= this.totalRecords);

    if (!validOptions.includes(this.totalRecords)) {
      validOptions.push(this.totalRecords);
    }

    return validOptions.sort((a, b) => a - b);
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value.toLowerCase();
    this.filteredProducts = this.products.filter((product) => {
      return (
        product.id.toString().includes(value) ||
        product.en_food_name.toLowerCase().includes(value) ||
        product.ar_food_name.toLowerCase().includes(value) ||
        (product.status === 1 ? "active" : "inactive").includes(value)
      );
    });
  }

  onSort(event: any) {
    // Handle sorting logic here
    const field = event.field;
    const order = event.order;

    // Sort the filtered products array
    this.filteredProducts.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      // Handle different field types
      if (field === "id") {
        valueA = Number(a.id);
        valueB = Number(b.id);
      } else if (field === "en_food_name") {
        valueA = a.en_food_name;
        valueB = b.en_food_name;
      } else if (field === "ar_food_name") {
        valueA = a.ar_food_name;
        valueB = b.ar_food_name;
      } else if (field === "status") {
        valueA = a.status;
        valueB = b.status;
      } else {
        // Default case
        valueA = (a as any)[field];
        valueB = (b as any)[field];
      }

      if (valueA < valueB) {
        return order === -1 ? -1 : 1;
      } else if (valueA > valueB) {
        return order === -1 ? 1 : -1;
      } else {
        return 0;
      }
    });
  }
}
