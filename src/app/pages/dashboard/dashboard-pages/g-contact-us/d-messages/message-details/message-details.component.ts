import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CardModule } from "primeng/card";
import { ListboxModule } from "primeng/listbox";
import { IGetMessageById } from "../../../../../../core/Interfaces/l-contact-form/IGetMessageById";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-message-details",
  standalone: true,
  imports: [CardModule, ListboxModule, DatePipe],
  templateUrl: "./message-details.component.html",
  styleUrl: "./message-details.component.scss",
})
export class MessageDetailsComponent {
  message!: IGetMessageById;
  messageDetails: { label: string; icon: string }[] = [];

  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.getMessageData();
  }

  getMessageData(): void {
    this.message = this.activatedRoute.snapshot.data["message"];
    if (this.message) {
      this.messageDetails = [
        { label: `Email: ${this.message.row.email}`, icon: "pi pi-envelope" },
        { label: `Phone: ${this.message.row.phone}`, icon: "pi pi-phone" },
      ];
    }
  }
}
