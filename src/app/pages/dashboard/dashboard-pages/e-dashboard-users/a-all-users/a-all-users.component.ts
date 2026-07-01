import { Component, inject } from "@angular/core";
import { Table, TableModule } from "primeng/table";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { ConfirmationService, MessageService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ButtonModule } from "primeng/button";
import { UsersService } from "../../../../../core/services/p-users/users.service";
import { usersData } from "../../../../../core/Interfaces/p-users/IGetAllUsers";
import { NgxSpinnerService } from "ngx-spinner";
import { timer } from "rxjs";
import { InputSwitchModule } from "primeng/inputswitch";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";
import { ToastModule } from "primeng/toast";
import { RouterLink } from "@angular/router";
import { ISelectOptions } from "../../../../../core/Interfaces/core/ISelectOptions";

@Component({
  selector: "app-a-all-users",
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    FormsModule,
    DropdownModule,
    ConfirmDialogModule,
    ButtonModule,
    InputSwitchModule,
    LoadingDataBannerComponent,
    ToastModule,
    RouterLink,
  ],
  templateUrl: "./a-all-users.component.html",
  styleUrl: "./a-all-users.component.scss",
  providers: [ConfirmationService, MessageService],
})
export class AAllUsersComponent {
  users: usersData[] = [];
  selectedUsers: usersData[] = [];

  roles: string[] = ["User", "Admin"];

  private confirmationService = inject(ConfirmationService);

  private ngxSpinnerService = inject(NgxSpinnerService);

  private messageService = inject(MessageService);

  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.rows.data;
        this.selectedUsers = response.rows.data.filter((user) => user.admin_status === 1);
      },
    });
  }

  onGlobalFilter(dt: Table, event: any) {
    const value = event.target.value;
    dt.filterGlobal(value, "contains");
  }

  confirmRoleChange(user: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to change the role of ${user.name}?`,
      header: "Confirm Role Change",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        user.role = user.role === "User" ? "Admin" : "User";
        // this.adminUserService.updateUser(user).subscribe(() => {
        //   this.messageService.add({
        //     severity: "success",
        //     summary: "Success",
        //     detail: `User role updated to ${user.role}`,
        //   });
        // });
      },
    });
  }

  confirmToggleStatus(user: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to ${user.status === "Active" ? "deactivate" : "activate"} ${user.name}?`,
      header: "Confirm Status Change",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        user.status = user.status === "Active" ? "Inactive" : "Active";
        // this.adminUserService.updateUser(user).subscribe(() => {
        //   this.messageService.add({
        //     severity: "success",
        //     summary: "Success",
        //     detail: `User status changed to ${user.status}`,
        //   });
        // });
      },
    });
  }

  confirmDelete(user: any): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      header: "Confirm Deletion",
      icon: "pi pi-exclamation-triangle",
      // accept: () => {
      //   this.adminUserService.deleteUser(user.id).subscribe(() => {
      //     this.users = this.users.filter((u) => u.id !== user.id);
      //     this.filteredUsers = this.filteredUsers.filter((u) => u.id !== user.id);
      //     this.messageService.add({ severity: "success", summary: "Deleted", detail: `User ${user.name} deleted.` });
      //   });
      // },
    });
  }

  // Toggle Coupon
  toggleUsersStatus(usersData: usersData) {
    this.ngxSpinnerService.show("actionsLoader");
    this.messageService.clear();

    const updatedStatus = usersData.admin_status ? 0 : 1; // Toggle between 0 and 1
    if (updatedStatus) {
      this.usersService.updateUser(usersData.id.toString(), { admin_status: updatedStatus }).subscribe(() => {
        usersData.admin_status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `User ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    } else {
      this.usersService.updateUser(usersData.id.toString(), { admin_status: updatedStatus }).subscribe(() => {
        usersData.admin_status = updatedStatus; // Update the UI immediately
        this.messageService.add({
          severity: "success",
          summary: "Updated",
          detail: `User ${updatedStatus ? "Enabled" : "Disabled"} successfully`,
        });
        timer(200).subscribe(() => this.ngxSpinnerService.hide("actionsLoader"));
      });
    }
  }

  totalRecords: number = 0;
  rowsPerPage = 10;
  currentPage = 1;

  onPageChange(event: any) {
    this.currentPage = event.first / event.rows + 1; // Convert to 1-based index
    this.rowsPerPage = event.rows;
    this.loadProducts(this.currentPage, this.rowsPerPage);
  }

  loadProducts(page: number, perPage: number) {
    this.ngxSpinnerService.show("actionsLoader");

    this.usersService.getAllUsers(page, perPage).subscribe({
      next: (response) => {
        this.ngxSpinnerService.hide("actionsLoader");
        this.users = response.rows.data;
      },
    });
  }

  getPagination(): number[] {
    if (this.totalRecords === 0) return [0];

    const options = [10, 100, 500, 1000];
    const validOptions = options.filter((opt) => opt <= this.totalRecords);

    if (!validOptions.includes(this.totalRecords)) {
      validOptions.push(this.totalRecords);
    }

    return validOptions.sort((a, b) => a - b);
  }

  disableSelectedUsers(): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to disable selected users?",
      header: "Disable Confirmation",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "No",
      acceptLabel: "Yes",
      closeOnEscape: true,
      acceptButtonStyleClass: "p-button-danger mx-2",

      accept: () => {
        this.ngxSpinnerService.show("actionsLoader");
        const SelectedUsers = this.selectedUsers.map((user) => user.id);
        let data = { users_ids: SelectedUsers, admin_status: 0 };
        console.log(SelectedUsers);
        this.usersService.disableSelectedUsers("1", data).subscribe((response) => {
          this.loadProducts(this.currentPage, this.rowsPerPage);
        });
      },
      reject: () => {},
    });
  }
  enableSelectedUsers(): void {
    this.confirmationService.confirm({
      message: "Are you sure you want to enable selected users?",
      header: "Enable Confirmation",
      icon: "pi pi-exclamation-triangle",
      rejectLabel: "No",
      acceptLabel: "Yes",
      closeOnEscape: true,
      acceptButtonStyleClass: "p-button-danger mx-2",

      accept: () => {
        this.ngxSpinnerService.show("actionsLoader");
        const SelectedUsers = this.selectedUsers.map((user) => user.id);
        let data = { users_ids: SelectedUsers, admin_status: 1 };
        console.log(SelectedUsers);
        this.usersService.disableSelectedUsers("1", data).subscribe((response) => {
          this.loadProducts(this.currentPage, this.rowsPerPage);
        });
      },
      reject: () => {},
    });
  }
}
