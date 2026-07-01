import { ResolveFn } from "@angular/router";
import { IGetSubLocationById } from "../../Interfaces/e-sublocations/IGetSubLocationById";
import { inject } from "@angular/core";
import { SubLocationsService } from "../../services/e-sublocations/sub-locations.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const subLocationsResolver: ResolveFn<boolean | IGetSubLocationById> = (route, state) => {
  const subLocationsService = inject(SubLocationsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return subLocationsService.getLocationById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
