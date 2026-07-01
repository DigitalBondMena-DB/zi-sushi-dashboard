import { Component } from '@angular/core';
import { LoginComponent } from '../../../auth/components/login/login.component';
import { DashboardFooterComponent } from '../../../pages/dashboard/dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [LoginComponent, DashboardFooterComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent {}
