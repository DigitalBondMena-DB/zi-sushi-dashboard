import { Component, effect, input } from "@angular/core";
import { ISuperAdminResponse } from "../../../../../core/Interfaces/m-home/IHomeStatics";
import { ChartModule } from "primeng/chart";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Color, NgxChartsModule, ScaleType } from "@swimlane/ngx-charts";
import { Chart } from "chart.js";
import { LoadingDataBannerComponent } from "../../../../../shared/components/loading-data-banner/loading-data-banner.component";

@Component({
  selector: "app-charts",
  standalone: true,
  imports: [ChartModule, CardModule, CommonModule, NgxChartsModule, LoadingDataBannerComponent],
  templateUrl: "./charts.component.html",
  styleUrl: "./charts.component.scss",
})
export class ChartsComponent {
  Statics = input<ISuperAdminResponse>();

  ngOnInit(): void {
    this.Statics();
  }

  constructor() {
    Chart.register(ChartDataLabels);

    effect(() => {
      this.Statics();
      this.initializeTotalComparisonData();
      this.initializeBranchComparisonDataSecond();
    });
  }

  // Chart Data
  totalDeliveredData: any;
  totalRevenueData: any;
  branchOrderData: any[] | undefined = [];
  branchRevenueData: any[] | undefined = [];

  colorScheme: Color = {
    name: "customScheme",
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ["#2EB432", "#F44336"], // Swapped: Delivered (green), Cancelled (red)
  };

  initializeTotalComparisonData() {
    // Pie chart for Total Delivered vs Cancelled Orders
    this.totalDeliveredData = {
      labels: ["Total Delivered Orders", "Total Cancelled Orders"],
      datasets: [
        {
          label: "Orders Comparison",
          data: [this.Statics()?.totalDelivered, this.Statics()?.totalCancelled],
          backgroundColor: ["#2EB432", "#F44336"], // Swapped: Delivered (green), Cancelled (red)
          borderColor: ["#2EB432", "#F44336"], // Swapped: Delivered (green), Cancelled (red)
          borderWidth: 1,
        },
      ],
    };

    // Pie chart for Total Delivered vs Cancelled Revenue
    this.totalRevenueData = {
      labels: ["Total Delivered Revenue", "Total Cancelled Revenue"],
      datasets: [
        {
          label: "Revenue Comparison",
          data: [this.Statics()?.totalDeliveredMoney, this.Statics()?.totalCancelledMoney],
          backgroundColor: ["#2EB432", "#F44336"], // Swapped: Delivered (green), Cancelled (red)
          borderColor: ["#2EB432", "#F44336"], // Swapped: Delivered (green), Cancelled (red)
          borderWidth: 1,
        },
      ],
    };
  }

  // Chart Options with DataLabels for displaying percentages on pie chart slices
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        color: "#fff",
        anchor: "center",
        align: "center",
        font: { size: 16, weight: "bold" },
        formatter: (value: any, ctx: any) => {
          const total = ctx.dataset.data.reduce((sum: number, data: number) => sum + data, 0);
          return `${((value / total) * 100).toFixed(1)}%`;
        },
      },
    },
  };

  initializeBranchComparisonDataSecond() {
    const branches = this.Statics()?.branches;

    if (branches && branches.length > 0) {
      this.branchOrderData = branches.map((branch) => ({
        name: branch.branch_name,
        series: [
          { name: "Delivered Orders", value: branch.delivered_orders },
          { name: "Cancelled Orders", value: branch.cancelled_orders },
        ],
      }));

      this.branchRevenueData = branches.map((branch) => ({
        name: branch.branch_name,
        series: [
          { name: "Delivered Revenue", value: branch.delivered_orders_money },
          { name: "Cancelled Revenue", value: branch.cancelled_orders_money },
        ],
      }));
    } else {
      const fallbackBranchName = "Your Branch";

      this.branchOrderData = [
        {
          name: fallbackBranchName,
          series: [
            { name: "Delivered Orders", value: this.Statics()?.totalDelivered ?? 0 },
            { name: "Cancelled Orders", value: this.Statics()?.totalCancelled ?? 0 },
          ],
        },
      ];

      this.branchRevenueData = [
        {
          name: fallbackBranchName,
          series: [
            { name: "Delivered Revenue", value: this.Statics()?.totalDeliveredMoney ?? 0 },
            { name: "Cancelled Revenue", value: this.Statics()?.totalCancelledMoney ?? 0 },
          ],
        },
      ];
    }
  }
}