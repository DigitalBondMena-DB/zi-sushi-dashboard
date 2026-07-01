import { ResolveFn } from "@angular/router";
import { UsersService } from "../../services/p-users/users.service";
import { inject } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";
import { IGetUserById } from "../../Interfaces/p-users/IGetUserById";

export const usersDetailsResolver: ResolveFn<boolean | IGetUserById> = (route, state) => {
  const usersService = inject(UsersService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return usersService.getUserById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
