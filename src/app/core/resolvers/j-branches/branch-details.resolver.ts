import { ResolveFn } from "@angular/router";
import { IBranchById } from "../../Interfaces/j-branches/IBranchById";
import { inject } from "@angular/core";
import { BranchesService } from "../../services/j-branches/branches.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const branchDetailsResolver: ResolveFn<boolean | IBranchById> = (route, state) => {
  const branchesService = inject(BranchesService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return branchesService.getBranchById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
