import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CheckPlatformService {
  constructor(@Inject(PLATFORM_ID) private _PLATFORM_ID: object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this._PLATFORM_ID);
  }
  isServer(): boolean {
    return isPlatformServer(this._PLATFORM_ID);
  }
}
