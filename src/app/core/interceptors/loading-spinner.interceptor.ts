import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

// Flag to track if it's the first reload
let isFirstLoad = true;

export const loadingSpinnerInterceptor: HttpInterceptorFn = (req, next) => {
  const spinner = inject(NgxSpinnerService);

  // Show the spinner only if it's the first load
  if (isFirstLoad) {
    spinner.show();
    isFirstLoad = false; // Set flag to false after first load
  }

  return next(req).pipe(
    finalize(() => {
      if (isFirstLoad === false) {
        setTimeout(() => {}, 2000);
        spinner.hide();
      }
    })
  );
};
