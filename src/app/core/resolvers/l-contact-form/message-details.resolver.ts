import { ResolveFn } from "@angular/router";
import { IGetMessageById } from "../../Interfaces/l-contact-form/IGetMessageById";
import { inject } from "@angular/core";
import { ContactUsInboxService } from "../../services/l-contact-form/contact-us-inbox.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize, timer } from "rxjs";

export const messageDetailsResolver: ResolveFn<IGetMessageById> = (route, state) => {
  const contactUsInboxService = inject(ContactUsInboxService);
  const ngxSpinnerService = inject(NgxSpinnerService);
  ngxSpinnerService.show("actionsLoader");
  return contactUsInboxService.getContactUsMessagesById(route.paramMap.get("id")!).pipe(
    finalize(() => {
      timer(200).subscribe(() => ngxSpinnerService.hide("actionsLoader"));
    })
  );
};
