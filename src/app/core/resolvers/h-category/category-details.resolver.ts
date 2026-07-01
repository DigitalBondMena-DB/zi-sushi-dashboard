import { ResolveFn } from "@angular/router";
import { ICategoryById } from "../../Interfaces/h-category/ICategoryById";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { CategoriesService } from "../../services/h-category/categories.service";
import { finalize, timer } from "rxjs";

export const categoryDetailsResolver: ResolveFn<boolean | ICategoryById> = (route, state) => {
  const categoriesService = inject(CategoriesService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show("actionsLoader");
  if (route.paramMap.get("id")) {
    return categoriesService.getCategoryById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }
  return true;
};
