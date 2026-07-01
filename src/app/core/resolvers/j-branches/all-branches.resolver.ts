import { ResolveFn } from "@angular/router";
import { BranchesService } from "../../services/j-branches/branches.service";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { IAllBranches } from "../../Interfaces/j-branches/IAllBranches";

export const allBranchesResolver: ResolveFn<boolean | IAllBranches> = (route, state) => {
  const branchesService = inject(BranchesService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  return branchesService.getAllBranches().pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );

  return true;
};
