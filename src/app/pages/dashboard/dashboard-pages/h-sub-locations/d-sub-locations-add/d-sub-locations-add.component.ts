import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";
import { InputSwitchModule } from "primeng/inputswitch";
import { timer } from "rxjs";
import { IAddSubLocationBody } from "../../../../../core/Interfaces/e-sublocations/IAddSubLocationBody";
import { SubLocationsService } from "../../../../../core/services/e-sublocations/sub-locations.service";
import { DropdownModule } from "primeng/dropdown";
import { IBranch, ILocation } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationsBranches";
import { IGetSubLocationById } from "../../../../../core/Interfaces/e-sublocations/IGetSubLocationById";
import { DividerModule } from "primeng/divider";
import { FloatLabelModule } from "primeng/floatlabel";
import { CommonModule } from "@angular/common";
import { OnlyNumberDirective } from "../../../../../only-number.directive";

@Component({
  selector: "app-d-sub-locations-add",
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    InputSwitchModule,
    CommonModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DropdownModule,
    DividerModule,
    FloatLabelModule,
    OnlyNumberDirective,
  ],
  templateUrl: "./d-sub-locations-add.component.html",
  styleUrl: "./d-sub-locations-add.component.scss",
  providers: [MessageService],
})
export class DSubLocationsAddComponent {
  subLocationForm: FormGroup;

  isEditing = false;

  subLocationId: string | null = null;

  locations: ILocation[] = [];

  Branches: IBranch[] = [];

  private fb = inject(FormBuilder);

  private subLocationsService = inject(SubLocationsService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private router = inject(Router);

  private messageService = inject(MessageService);

  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.subLocationForm = this.fb.group({
      en_sub_location: ["", Validators.required],
      ar_sub_location: ["", Validators.required],
      location_id: ["", Validators.required],
      price: ["", Validators.required],
      branch_id: ["", Validators.required],
      status: [1, Validators.required],
    });
  }

  ngOnInit() {
    const DATA = this.activatedRoute.snapshot.data["subLocations"] as IGetSubLocationById;
    if (DATA) {
      this.isEditing = true;
      this.subLocationForm.patchValue(DATA.sublocation);
      this.Branches = DATA.branches;
      this.locations = DATA.locations;
      this.subLocationId = DATA.sublocation.id.toString();
    } else {
      this.getBranchesData();
    }
  }

  getBranchesData(): void {
    this.subLocationsService.getSubLocationsBranches().subscribe({
      next: (response) => {
        this.Branches = response.branches;
        this.locations = response.locations;
      },
    });
  }

  saveSubLocation(): void {
    this.subLocationForm.markAllAsTouched();
    if (this.subLocationForm.invalid) return;
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();
    const subLocationBody: IAddSubLocationBody = this.subLocationForm.value;

    if (this.isEditing && this.subLocationId) {
      this.subLocationsService.updateLocation(this.subLocationId, subLocationBody).subscribe(() => {
        this.router.navigate(["/dashboard/sub-locations/"]);
        this.messageService.add({ severity: "success", summary: "Updated", detail: "Area updated successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.subLocationsService.addLocation(subLocationBody).subscribe(() => {
        this.router.navigate(["/dashboard/sub-locations/"]);
        this.messageService.add({ severity: "success", summary: "Added", detail: "Area added successfully" });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }
}
