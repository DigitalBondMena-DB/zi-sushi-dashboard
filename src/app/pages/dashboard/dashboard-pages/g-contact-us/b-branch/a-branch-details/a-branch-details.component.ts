import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { TagModule } from "primeng/tag";
import { IBranchById } from "../../../../../../core/Interfaces/j-branches/IBranchById";

@Component({
  selector: "app-a-branch-details",
  standalone: true,
  imports: [TagModule, CommonModule, CardModule, ButtonModule, RouterLink],
  templateUrl: "./a-branch-details.component.html",
  styleUrl: "./a-branch-details.component.scss",
})
export class ABranchDetailsComponent {
  private ActivatedRoute = inject(ActivatedRoute);

  branchData!: IBranchById;

  ngOnInit(): void {
    this.branchData = this.ActivatedRoute.snapshot.data["branch"];
  }
}
