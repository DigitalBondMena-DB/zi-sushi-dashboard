import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { IGetAllSubLocations } from "../../Interfaces/e-sublocations/IGetAllSubLocations";
import { IGetSubLocationsBranches } from "../../Interfaces/e-sublocations/IGetSubLocationsBranches";
import { IGetSubLocationById } from "../../Interfaces/e-sublocations/IGetSubLocationById";
import { IAddSubLocationResponse } from "../../Interfaces/e-sublocations/IAddSubLocationResponse";
import { IAddSubLocationBody } from "../../Interfaces/e-sublocations/IAddSubLocationBody";
import { IUpdateSubLocationBody } from "../../Interfaces/e-sublocations/IUpdateSubLocationBody";
import { IUpdateSubLocationResponse } from "../../Interfaces/e-sublocations/IUpdateSubLocationResponse";
import { IToggleSubLocation } from "../../Interfaces/e-sublocations/IToggleSubLocation";

@Injectable({
  providedIn: "root",
})
export class SubLocationsService {
  constructor(private http: HttpClient) {}

  getAllLocations(page: number = 1, perPage: number = 10) {
    return this.http.get<IGetAllSubLocations>(`${WEB_SITE_BASE_URL}sublocation_index?page=${page}&limit=${perPage}`);
  }
  getSubLocationsBranches() {
    return this.http.get<IGetSubLocationsBranches>(`${WEB_SITE_BASE_URL}getlocationinfo`);
  }
  getLocationById(locationId: string) {
    return this.http.get<IGetSubLocationById>(`${WEB_SITE_BASE_URL}sublocation_data/${locationId}`);
  }
  addLocation(locationsData: IAddSubLocationBody) {
    return this.http.post<IAddSubLocationResponse>(`${WEB_SITE_BASE_URL}sublocation_store`, locationsData);
  }
  updateLocation(locationId: string, locationData: IUpdateSubLocationBody) {
    return this.http.post<IUpdateSubLocationResponse>(
      `${WEB_SITE_BASE_URL}sublocation_update/${locationId}`,
      locationData
    );
  }
  destroyLocation(locationId: string) {
    return this.http.post<IToggleSubLocation>(`${WEB_SITE_BASE_URL}sublocation_destroy/${locationId}`, {});
  }
  enableLocation(locationId: string) {
    return this.http.post<IToggleSubLocation>(`${WEB_SITE_BASE_URL}sublocation_enable/${locationId}`, {});
  }
}
