import { ResolveFn } from "@angular/router";
import { IGetBoxById } from "../../Interfaces/c-hot-boxes/IGetBoxById";
import { HotBoxesService } from "../../services/c-hot-boxes/hot-boxes.service";
import { NgxSpinnerService } from "ngx-spinner";
import { inject } from "@angular/core";
import { finalize, timer } from "rxjs";

export const hotBoxesDetailsResolver: ResolveFn<true | IGetBoxById> = (route, state) => {
  const hotBoxesService = inject(HotBoxesService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return hotBoxesService.getBoxById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
