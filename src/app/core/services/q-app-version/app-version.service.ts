import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IZiVersionResponse } from "../../Interfaces/q-app-version/IZiVersionResponse";
import { IZiVersionUpdatePayload } from "../../Interfaces/q-app-version/IZiVersionUpdatePayload";

@Injectable({
  providedIn: "root",
})
export class AppVersionService {
  private http = inject(HttpClient);

  getVersion() {
    return this.http.get<IZiVersionResponse>(`${WEB_SITE_BASE_URL}ZiVersion_index`);
  }

  updateVersion(payload: IZiVersionUpdatePayload) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}ZiVersion_store`, payload);
  }
}
