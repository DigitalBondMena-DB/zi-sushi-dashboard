export interface ISuperAdminResponse {
  totalOrders: number;
  totalDelivered: number;
  totalCancelled: number;
  totalOrdersMoney: number;
  totalDeliveredMoney: number;
  totalCancelledMoney: number;
  branches: Branch[];
  usersTotal: number;
  categoriesTotal: number;
  productsTotal: number;
}

export interface Branch {
  branch_name: string;
  total_orders: number;
  total_orders_money: number;
  delivered_orders: number;
  delivered_orders_money: number;
  cancelled_orders: number;
  cancelled_orders_money: number;
}
