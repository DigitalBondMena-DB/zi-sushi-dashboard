import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { SlidersService } from "../../services/r-sliders/sliders.service";
import { IGetSliderById } from "../../Interfaces/r-sliders/IGetSliderById";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const sliderDetailsResolver: ResolveFn<boolean | IGetSliderById> = (route, state) => {
  const slidersService = inject(SlidersService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return slidersService.getSliderById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
