import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize, of, timer } from 'rxjs';
import { IPromoCode } from '../model/promo-code';
import { PromoCodeService } from '../services/promo-code.service';

export const promoCodeDetailsResolver: ResolveFn<IPromoCode | null> = (
  route,
  state
) => {
  const promoCodeService = inject(PromoCodeService);
  const ngxSpinnerService = inject(NgxSpinnerService);

  ngxSpinnerService.show('actionsLoader');

  const id = route.paramMap.get('id');

  if (id) {
    return promoCodeService.getSinglePromoCode(id).pipe(
      finalize(() => {
        timer(200).subscribe(() => ngxSpinnerService.hide('actionsLoader'));
      })
    );
  }

  ngxSpinnerService.hide('actionsLoader');
  return of(null);
};
