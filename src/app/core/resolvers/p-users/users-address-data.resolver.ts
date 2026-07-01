import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { IGetSubLocationsBranches } from "../../Interfaces/e-sublocations/IGetSubLocationsBranches";
import { SubLocationsService } from "../../services/e-sublocations/sub-locations.service";

export const usersAddressDataResolver: ResolveFn<boolean | IGetSubLocationsBranches> = (route, state) => {
  const subLocationsService = inject(SubLocationsService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return subLocationsService.getSubLocationsBranches().pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
