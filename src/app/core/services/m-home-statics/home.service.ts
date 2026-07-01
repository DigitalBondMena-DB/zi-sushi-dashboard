import { isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Observable, of } from "rxjs";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { User } from "../../Interfaces/p-users/IUpdateUserResponse";
import { ISuperAdminResponse } from "./../../Interfaces/m-home/IHomeStatics";
import dayjs, { Dayjs } from "dayjs";

@Injectable({
  providedIn: "root",
})
export class HomeService {
  http = inject(HttpClient);

  _PLATFORM_ID = inject(PLATFORM_ID);

  getHomeStatics(first_date?: string, second_date?: string, single_date?: string): Observable<ISuperAdminResponse> {
    let userData = {} as User;
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      userData = JSON.parse(localStorage.getItem("user")!);
    }

    // Define the request body dynamically
    let requestBody: any = {};

    if (first_date && second_date) {
      requestBody = {
        first_date: dayjs(first_date).format("YYYY-MM-DD"),
        second_date: dayjs(second_date).format("YYYY-MM-DD"),
      };
    } else if (single_date) {
      requestBody = { single_date: dayjs(single_date).format("YYYY-MM-DD") };
    }

    // Determine the endpoint
    const endpoint = userData.branch_id
      ? `${WEB_SITE_BASE_URL}ordershome/${userData.branch_id}`
      : `${WEB_SITE_BASE_URL}ordershome/all`;

    return this.http.post<ISuperAdminResponse>(endpoint, requestBody);
  }
}
