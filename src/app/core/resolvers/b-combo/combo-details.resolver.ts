import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { IGetComboOfferById } from "../../Interfaces/b-combo/IGetComboOfferById";
import { ComboService } from "../../services/b-combo/combo.service";

export const comboDetailsResolver: ResolveFn<boolean | IGetComboOfferById> = (route, state) => {
  const comboService = inject(ComboService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return comboService.getComboOfferById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
