import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IAboutUsUpdateResponse } from "../../Interfaces/n-about-us/IAboutUsUpdateResponse";
import { IAboutUsData } from "./../../Interfaces/n-about-us/IAboutUsData";

@Injectable({
  providedIn: "root",
})
export class AboutUsService {
  constructor(private http: HttpClient) {}

  getAboutUs() {
    return this.http.get<IAboutUsData>(`${WEB_SITE_BASE_URL}about_index`);
  }
  updateAboutUs(aboutUsData: FormData) {
    return this.http.post<IAboutUsUpdateResponse>(`${WEB_SITE_BASE_URL}about_update/1`, aboutUsData);
  }
}
