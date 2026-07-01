import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { TutorialService } from "../../services/a-tutorial-content/tutorial.service";
import { IGetTutorialById } from "../../Interfaces/a-tutorial-content/IGetTutorialById";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const tutorialDetailsResolver: ResolveFn<boolean | IGetTutorialById> = (route, state) => {
  const couponService = inject(TutorialService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return couponService.getTutorialById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
