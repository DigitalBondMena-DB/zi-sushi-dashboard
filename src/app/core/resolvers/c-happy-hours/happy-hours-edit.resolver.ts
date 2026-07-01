import { ResolveFn } from "@angular/router";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { HappyHoursService } from "../../services/c-happy-hours/happy-hours.service";
import { IHappyHours } from "../../Interfaces/c-happy-hours/ihappy-hours";

export const HappyHoursEditResolver: ResolveFn<boolean | IHappyHours> = (route, state) => {
  const happyHoursService = inject(HappyHoursService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show("actionsLoader");
  if (route.paramMap.get("id")) {
    return happyHoursService.getHappyHoursById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }
  return true;
};
