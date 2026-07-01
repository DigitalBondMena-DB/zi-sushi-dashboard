import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllHotBoxes } from "../../Interfaces/c-hot-boxes/IGetAllHotBoxes";
import { IAddBoxResponse } from "../../Interfaces/c-hot-boxes/IAddBoxResponse";
import { IUpdateBoxResponse } from "../../Interfaces/c-hot-boxes/IUpdateBoxResponse";
import { IToggleBoxResponse } from "../../Interfaces/c-hot-boxes/IToggleBoxResponse";
import { IGetBoxById } from "../../Interfaces/c-hot-boxes/IGetBoxById";

@Injectable({
  providedIn: "root",
})
export class HotBoxesService {
  private http = inject(HttpClient);

  getAllHotBoxes(page: number = 1) {
    return this.http.get<IGetAllHotBoxes>(`${WEB_SITE_BASE_URL}hotboxes?page=${page}`);
  }
  getBoxById(boxId: string) {
    return this.http.get<IGetBoxById>(`${WEB_SITE_BASE_URL}product_data/${boxId}`);
  }
  addBox(boxData: {}) {
    return this.http.post<IAddBoxResponse>(`${WEB_SITE_BASE_URL}product_store`, boxData);
  }
  updateHotBox(boxId: string, boxData: {}) {
    return this.http.post<IUpdateBoxResponse>(`${WEB_SITE_BASE_URL}product_update/${boxId}`, boxData);
  }
  destroyBox(boxId: string) {
    return this.http.post<IToggleBoxResponse>(`${WEB_SITE_BASE_URL}product_destroy/${boxId}`, {});
  }
  enableBox(boxId: string) {
    return this.http.post<IToggleBoxResponse>(`${WEB_SITE_BASE_URL}product_enable/${boxId}`, {});
  }
}
