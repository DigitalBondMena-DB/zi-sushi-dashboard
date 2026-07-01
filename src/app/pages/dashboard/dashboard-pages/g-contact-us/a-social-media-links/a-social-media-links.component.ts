import { Component, inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { MessageService } from "primeng/api";
import { SocialLinksService } from "../../../../../core/services/k-contact-info/social-links.service";
import { ISocialMediaLinks } from "../../../../../core/Interfaces/k-contact-info/ISocialMediaLinks";
import { ISocialMediaUpdate } from "../../../../../core/Interfaces/k-contact-info/ISocialMediaUpdate";

@Component({
  selector: "app-a-social-media-links",
  standalone: true,
  imports: [FormsModule, ButtonModule, MessagesModule, ToastModule, LoadingDataBannerComponent],
  templateUrl: "./a-social-media-links.component.html",
  styleUrl: "./a-social-media-links.component.scss",
  providers: [MessageService],
})
export class ASocialMediaLinksComponent implements OnInit {
  socialMediaLinks: any[] = [];
  isLoading: boolean = false;
  private socialLinksService = inject(SocialLinksService);

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.fetchSocialMediaLinks();
  }

  fetchSocialMediaLinks() {
    this.isLoading = true;
    this.socialLinksService.getSocialMediaLinks().subscribe({
      next: (response: ISocialMediaLinks) => {
        if (response && response.rows) {
          this.socialMediaLinks = this.convertResponseToLinks(response.rows);
        }
        this.isLoading = false;
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to load social links" });
        this.isLoading = false;
      },
    });
  }

  // Convert API response into UI-friendly structure
  convertResponseToLinks(contact: ISocialMediaLinks["rows"]): any[] {
    return [
      { key: "tweet_link", label: "Twitter", icon: "pi-twitter", url: contact.tweet_link || "" },
      { key: "snap_link", label: "Snapchat", icon: "pi-comment", url: contact.snap_link || "" },
      { key: "insta_link", label: "Instagram", icon: "pi-instagram", url: contact.insta_link || "" },
      { key: "watus_link", label: "WhatsApp", icon: "pi-whatsapp", url: contact.watus_link || "" },
      { key: "tiktok_link", label: "TikTok", icon: "pi-tiktok", url: contact.tiktok_link || "" },
      { key: "face_link", label: "Facebook", icon: "pi-facebook", url: contact.face_link || "" },
      { key: "linked_link", label: "LinkedIn", icon: "pi-linkedin", url: contact.linked_link || "" },
      { key: "main_email", label: "Email", icon: "pi-envelope", url: contact.main_email || "" },
    ].filter((link) => link.url !== null); // Remove null values
  }

  saveChanges() {
    this.isLoading = true;
    const updatedLinks = this.convertLinksToRequestBody(this.socialMediaLinks);

    this.socialLinksService.updateSocialMediaLinks(updatedLinks).subscribe({
      next: () => {
        this.messageService.add({ severity: "success", summary: "Success", detail: "Changes saved successfully" });
        this.isLoading = false;
        this.fetchSocialMediaLinks();
      },
      error: () => {
        this.messageService.add({ severity: "error", summary: "Error", detail: "Failed to save changes" });
        this.isLoading = false;
      },
    });
  }

  // Convert UI input back to API format
  convertLinksToRequestBody(links: any[]): ISocialMediaUpdate {
    const requestBody: ISocialMediaUpdate = {
      tweet_link: "",
      snap_link: "",
      insta_link: "",
      watus_link: "",
      tiktok_link: "",
      face_link: "",
      linked_link: "",
      main_email: "",
    };

    links.forEach((link) => {
      if (requestBody.hasOwnProperty(link.key)) {
        requestBody[link.key as keyof ISocialMediaUpdate] = link.url.trim() || "";
      }
    });

    return requestBody;
  }
}
