import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IPrivacyPolicyData } from "../../Interfaces/o-privacy-policy/IPrivacyPolicyData";
import { IPrivacyPolicyUpdateResponse } from "../../Interfaces/o-privacy-policy/IPrivacyPolicyUpdateResponse";

@Injectable({
  providedIn: "root",
})
export class PrivacyPolicyService {
  constructor(private http: HttpClient) {}

  getPrivacyPolicy() {
    return this.http.get<IPrivacyPolicyData>(`${WEB_SITE_BASE_URL}privacy_index`);
  }
  updatePrivacyPolicy(privacyPolicyData: FormData) {
    return this.http.post<IPrivacyPolicyUpdateResponse>(`${WEB_SITE_BASE_URL}privacy_update/1`, privacyPolicyData);
  }
}
