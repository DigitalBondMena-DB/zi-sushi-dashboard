import { CommonModule, DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { ICategoryById } from "../../../../../../core/Interfaces/h-category/ICategoryById";

@Component({
  selector: "app-b-category-details",
  standalone: true,
  imports: [DatePipe, TagModule, CommonModule, CardModule, ButtonModule, RouterLink],
  templateUrl: "./b-category-details.component.html",
  styleUrl: "./b-category-details.component.scss",
})
export class BCategoryDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);

  categoryData!: ICategoryById;

  ngOnInit(): void {
    this.categoryData = this.ActivatedRoute.snapshot.data["category"];
  }
}
