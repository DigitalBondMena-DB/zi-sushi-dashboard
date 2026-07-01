import { ResolveFn } from "@angular/router";
import { IGetProductsCategories } from "../../Interfaces/d-products/IGetProductsCategories";
import { inject } from "@angular/core";
import { ProductsService } from "../../services/d-products/products.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const productsCategoriesResolver: ResolveFn<boolean | IGetProductsCategories> = (route, state) => {
  const productsService = inject(ProductsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  return productsService.getAllProductsCategories().pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );

  return true;
};
