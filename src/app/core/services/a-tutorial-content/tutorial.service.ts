import { Injectable } from "@angular/core";
import { WEB_SITE_BASE_URL } from "../../constants/WEB_SITE_BASE_UTL";
import { HttpClient } from "@angular/common/http";
import { ITutorialAddBody } from "../../Interfaces/a-tutorial-content/ITutorialAddBody";
import { ITutorialAddResponse } from "../../Interfaces/a-tutorial-content/ITutorialAddResponse";
import { ITutorialUpdateBody } from "../../Interfaces/a-tutorial-content/ITutorialUpdateBody";
import { IGetAllTutorials } from "../../Interfaces/a-tutorial-content/IGetAllTutorials";
import { IGetTutorialById } from "../../Interfaces/a-tutorial-content/IGetTutorialById";
import { ITutorialUpdateResponse } from "../../Interfaces/a-tutorial-content/ITutorialUpdateResponse";

@Injectable({
  providedIn: "root",
})
export class TutorialService {
  constructor(private http: HttpClient) {}

  getAllTutorial() {
    return this.http.get<IGetAllTutorials>(`${WEB_SITE_BASE_URL}toutrial_index`);
  }
  getTutorialById(tutorialId: string) {
    return this.http.get<IGetTutorialById>(`${WEB_SITE_BASE_URL}toutrial_data/${tutorialId}`);
  }
  addTutorial(tutorialData: ITutorialAddBody) {
    return this.http.post<ITutorialAddResponse>(`${WEB_SITE_BASE_URL}toutrial_store`, tutorialData);
  }
  updateTutorial(tutorialId: string, locationData: ITutorialUpdateBody) {
    return this.http.post<ITutorialUpdateResponse>(`${WEB_SITE_BASE_URL}toutrial_update/${tutorialId}`, locationData);
  }
  // destroyToutrial(tutorialId: string) {
  //   return this.http.post<any>(`${WEB_SITE_BASE_URL}toutrial_destroy/${tutorialId}`, {});
  // }
  // enableToutrial(tutorialId: string) {
  //   return this.http.post<any>(`${WEB_SITE_BASE_URL}toutrial_enable/${tutorialId}`, {});
  // }
}
