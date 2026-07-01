import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardFooterComponent } from '../../../pages/dashboard/dashboard-footer/dashboard-footer.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, DashboardFooterComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {}
