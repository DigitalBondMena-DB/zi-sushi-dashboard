import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ISocialMediaLinks } from "../../Interfaces/k-contact-info/ISocialMediaLinks";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { ISocialMediaUpdate } from "../../Interfaces/k-contact-info/ISocialMediaUpdate";

@Injectable({
  providedIn: "root",
})
export class SocialLinksService {
  constructor(private http: HttpClient) {}

  getSocialMediaLinks(): Observable<ISocialMediaLinks> {
    return this.http.get<ISocialMediaLinks>(`${WEB_SITE_BASE_URL}contactinfoindex`);
  }
  updateSocialMediaLinks(socialMedia: ISocialMediaUpdate): Observable<{ success: string }> {
    return this.http.post<{ success: string }>(`${WEB_SITE_BASE_URL}contactinfoupdate/1`, socialMedia);
  }
}
