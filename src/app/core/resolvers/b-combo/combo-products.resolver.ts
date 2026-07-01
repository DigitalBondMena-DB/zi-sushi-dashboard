import { ResolveFn } from "@angular/router";
import { ComboService } from "../../services/b-combo/combo.service";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { IGetAllComboProducts } from "../../Interfaces/b-combo/IGetAllComboProducts";

export const comboProductsResolver: ResolveFn<boolean | IGetAllComboProducts> = (route, state) => {
  const comboService = inject(ComboService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return comboService.getAllComboProducts().pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
