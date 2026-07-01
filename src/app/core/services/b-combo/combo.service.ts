import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IAddComboResponse } from "../../Interfaces/b-combo/IAddComboResponse";
import { IAddNewLimitResponse } from "../../Interfaces/b-combo/IAddNewLimitResponse";
import { IGetAllComboOffers } from "../../Interfaces/b-combo/IGetAllComboOffers";
import { IGetComboOfferById } from "../../Interfaces/b-combo/IGetComboOfferById";
import { IToggleComboOffer } from "../../Interfaces/b-combo/IToggleComboOffer";
import { IUpdateComboResponse } from "../../Interfaces/b-combo/IUpdateComboResponse";
import { IUpdateLimitResponse } from "../../Interfaces/b-combo/IUpdateLimitResponse";
import { IGetAllComboProducts } from "../../Interfaces/b-combo/IGetAllComboProducts";

@Injectable({
  providedIn: "root",
})
export class ComboService {
  private http = inject(HttpClient);

  getAllComboOffers(page: number = 1, perPage: number = 10) {
    return this.http.get<IGetAllComboOffers>(`${WEB_SITE_BASE_URL}combo_index?page=${page}&limit=${perPage}`);
  }

  getAllComboProducts() {
    return this.http.get<IGetAllComboProducts>(`${WEB_SITE_BASE_URL}getallproducts`);
  }

  updateComboOffer(comboId: string, comboData: {}) {
    return this.http.post<IUpdateComboResponse>(`${WEB_SITE_BASE_URL}combo_update/${comboId}`, comboData);
  }

  getComboOfferById(comboId: string) {
    return this.http.get<IGetComboOfferById>(`${WEB_SITE_BASE_URL}combo_data/${comboId}`);
  }

  addComboOffer(comboData: {}) {
    return this.http.post<IAddComboResponse>(`${WEB_SITE_BASE_URL}combo_store`, comboData);
  }
  enableComboOffer(comboId: string) {
    return this.http.post<IToggleComboOffer>(`${WEB_SITE_BASE_URL}combo_enable/${comboId}`, {});
  }
  disableComboOffer(comboId: string) {
    return this.http.post<IToggleComboOffer>(`${WEB_SITE_BASE_URL}combo_destroy/${comboId}`, {});
  }

  addNewLimit(comboId: string, limitData: {}) {
    return this.http.post<IAddNewLimitResponse>(`${WEB_SITE_BASE_URL}addnewlimit`, limitData);
  }
  updateLimit(comboId: string, limitData: {}) {
    return this.http.post<IUpdateLimitResponse>(`${WEB_SITE_BASE_URL}updatelimit/${comboId}`, limitData);
  }
}
