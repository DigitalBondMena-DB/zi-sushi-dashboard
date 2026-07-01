import { ResolveFn } from "@angular/router";
import { IOrderById } from "../../Interfaces/g-orders/IOrderById";
import { OrdersService } from "../../services/g-orders/orders.service";
import { inject } from "@angular/core";
import { finalize, timer } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";

export const orderDetailsResolver: ResolveFn<boolean | IOrderById> = (route, state) => {
  const ordersService = inject(OrdersService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");

  if (route.paramMap.get("id")) {
    return ordersService.getOrderById(route.paramMap.get("id")!).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
      })
    );
  }

  return true;
};
