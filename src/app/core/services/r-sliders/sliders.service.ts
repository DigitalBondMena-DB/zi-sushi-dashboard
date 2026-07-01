import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllSliders } from "../../Interfaces/r-sliders/IGetAllSliders";
import { IGetSliderById } from "../../Interfaces/r-sliders/IGetSliderById";

@Injectable({
  providedIn: "root",
})
export class SlidersService {
  private http = inject(HttpClient);

  getAllSliders(page: number = 1, perPage: number = 10) {
    return this.http.get<IGetAllSliders>(`${WEB_SITE_BASE_URL}slider_index?page=${page}&limit=${perPage}`);
  }

  getSliderById(sliderId: string) {
    return this.http.get<IGetSliderById>(`${WEB_SITE_BASE_URL}slider_data/${sliderId}`);
  }

  addSlider(sliderData: FormData) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}slider_store`, sliderData);
  }

  updateSlider(sliderId: string, sliderData: FormData) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}slider_update/${sliderId}`, sliderData);
  }

  destroySlider(sliderId: string) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}slider_destroy/${sliderId}`, {});
  }

  enableSlider(sliderId: string) {
    return this.http.post<any>(`${WEB_SITE_BASE_URL}slider_enable/${sliderId}`, {});
  }
}
