import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { ApplicationRef, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  first,
  interval,
  retryWhen,
  scan,
  switchMap,
  takeUntil,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

const NO_RETRY_APIS = [
  'signup',
  'signin',
  'resetUserCode',
  'resetUserPassword',
  'updateUserPassword',
  'deleteuseraccount',
  'updateUserProfile',
  'vouchers',
];

// Create subjects to track network status and control background retries
const networkStatus$ = new BehaviorSubject<'online' | 'offline'>('online');
const stopBackgroundRetries$ = new BehaviorSubject<boolean>(false);

export const networkInterceptor: HttpInterceptorFn = (req, next) => {
  const appRef = inject(ApplicationRef);
  const _PLATFORM_ID = inject(PLATFORM_ID);
  const _Router = inject(Router);
  const toastrService = inject(ToastrService);

  const shouldSkipRetry = NO_RETRY_APIS.some((endpoint) =>
    req.url.includes(endpoint)
  );

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000; // 2 seconds delay between retries
  const BACKGROUND_RETRY_DELAY = 5000; // 5 seconds delay for background retries
  const PENDING_TIMEOUT = 30000; // 30 seconds

  // Function to attempt the request
  const attemptRequest = () =>
    next(req).pipe(catchError((error) => throwError(() => error)));

  // Background retry mechanism
  const startBackgroundRetries = () => {
    stopBackgroundRetries$.next(false);
    return interval(BACKGROUND_RETRY_DELAY).pipe(
      takeUntil(stopBackgroundRetries$),
      switchMap(() => {
        if (navigator.onLine) {
          return attemptRequest().pipe(
            catchError((error) => {
              // Still failing, continue background retries
              return throwError(() => error);
            })
          );
        }
        return throwError(() => new Error('Still offline'));
      })
    );
  };

  return next(req).pipe(
    shouldSkipRetry
      ? catchError((error: HttpErrorResponse) => throwError(() => error))
      : retryWhen((errors) =>
          errors.pipe(
            scan((retryCount, error) => {
              if (!navigator.onLine) {
                networkStatus$.next('offline');
                toastrService.warning(
                  'No internet connection. Retrying in background...',
                  'Connection Issue',
                  {
                    timeOut: 0,
                    extendedTimeOut: 0,
                    closeButton: true,
                    progressBar: true,
                  }
                );
              }

              // Initial retry logic
              if (retryCount >= MAX_RETRIES) {
                // Start background retries
                startBackgroundRetries().subscribe({
                  next: () => {
                    // If we get here, the request succeeded
                    stopBackgroundRetries$.next(true);
                    networkStatus$.next('online');
                    toastrService.success(
                      'Connection restored! You can continue using the application.',
                      'Connected',
                      {
                        timeOut: 3000,
                        progressBar: true,
                        positionClass: 'toast-top-right',
                      }
                    );
                  },
                  error: () => {
                    // Background retry failed, continue trying
                  },
                });

                // Show refresh message
                toastrService.error(
                  'Unable to connect to the server. Retrying in background...',
                  'Connection Failed',
                  {
                    timeOut: 0,
                    extendedTimeOut: 0,
                    closeButton: true,
                    progressBar: true,
                    tapToDismiss: false,
                  }
                );
                throw error;
              }

              // Show retry attempt toast
              toastrService.info(
                `Attempting to reconnect... (${retryCount + 1}/${MAX_RETRIES})`,
                'Retrying Connection',
                {
                  timeOut: RETRY_DELAY,
                  progressBar: true,
                }
              );

              return retryCount + 1;
            }, 0),
            delay(RETRY_DELAY)
          )
        ),
    finalize(() => {
      if (isPlatformBrowser(_PLATFORM_ID)) {
        appRef.isStable.pipe(
          first((stable) => stable),
          timeout(10000)
        );
      }
    }),
    timeout(PENDING_TIMEOUT),
    catchError((error: any) => {
      if (error instanceof TimeoutError) {
        toastrService.error(
          'The request is taking longer than expected. Please try again.',
          'Request Timeout',
          {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: true,
            progressBar: true,
          }
        );
      }
      return throwError(() => error);
    })
  );
};
