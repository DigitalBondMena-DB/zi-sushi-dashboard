import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, of, timer } from 'rxjs';
import { IVoucher } from '../model/voucher';
import { VoucherService } from '../services/voucher.service';

export const voucherDetailsResolver: ResolveFn<IVoucher | null> = (
  route,
  state
) => {
  const voucherService = inject(VoucherService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  const id = route.paramMap.get('id');

  if (id) {
    return voucherService.getSingleVoucher(id).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide('actionsLoader'));
      })
    );
  }

  ngxSpinnerService.hide('actionsLoader');
  return of(null);
};
