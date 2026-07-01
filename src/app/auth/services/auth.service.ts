import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { WEB_SITE_BASE_URL } from "../../core/constants/WEB_SITE_BASE_UTL";
import { ILogInResponse } from "../interfaces/ILoninResponse";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}
  login(userData: {}) {
    return this.http.post<ILogInResponse>(`${WEB_SITE_BASE_URL}signin`, userData);
  }
}
