import { Routes } from '@angular/router';
import { authGuard } from './auth/gurd/auth.guard';
import { loginGuard } from './auth/gurd/login.guard';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { tutorialDetailsResolver } from './core/resolvers/a-tutorial-content/tutorial-details.resolver';
import { comboDetailsResolver } from './core/resolvers/b-combo/combo-details.resolver';
import { comboProductsResolver } from './core/resolvers/b-combo/combo-products.resolver';
import { hotBoxesDetailsResolver } from './core/resolvers/c-hot-boxes/hot-boxes-details.resolver';
import { productDetailsResolver } from './core/resolvers/d-products/product-details.resolver';
import { productsCategoriesResolver } from './core/resolvers/d-products/products-categories.resolver';
import { subLocationsResolver } from './core/resolvers/e-sublocations/sub-locations.resolver';
import { orderDetailsResolver } from './core/resolvers/g-orders/order-details.resolver';
import { categoryDetailsResolver } from './core/resolvers/h-category/category-details.resolver';
import { couponDetailsResolver } from './core/resolvers/i-coupon/coupon-details.resolver';
import { allBranchesResolver } from './core/resolvers/j-branches/all-branches.resolver';
import { branchDetailsResolver } from './core/resolvers/j-branches/branch-details.resolver';
import { messageDetailsResolver } from './core/resolvers/l-contact-form/message-details.resolver';
import { usersAddressDataResolver } from './core/resolvers/p-users/users-address-data.resolver';
import { usersDetailsResolver } from './core/resolvers/p-users/users-details.resolver';
import { promoCodeDetailsResolver } from './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/res/guards/promo-code.guard';
import { voucherDetailsResolver } from './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/res/guards/voucher.guard';
import { JInternetConnectionComponent } from './pages/dashboard/dashboard-pages/j-internet-connection/j-internet-connection.component';
import { HappyHoursEditResolver } from './core/resolvers/c-happy-hours/happy-hours-edit.resolver';
import { sliderDetailsResolver } from './core/resolvers/r-sliders/slider-details.resolver';

export const routes: Routes = [
  // Auth
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./auth/components/login/login.component').then(
            (c) => c.LoginComponent
          ),
        data: {
          title: 'Zi Sushi - login',
          description: 'Login Page',
        },
      },
    ],
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./core/layouts/dashboard-layout/dashboard-layout.component').then(
        (c) => c.DashboardLayoutComponent
      ),
    canActivate: [loginGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './pages/dashboard/dashboard-pages/dashboard-pages.component'
          ).then((c) => c.DashboardPagesComponent),
        data: {
          title: 'Zi Sushi',
          description: 'Dashboard Page',
        },
        children: [
          {
            path: '',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/a-dashboard-home/a-dashboard-home.component'
              ).then((c) => c.ADashboardHomeComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
          },
          // offers
          {
            path: 'offers',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/b-dashboard-offers/b-dashboard-offers.component'
              ).then((c) => c.BDashboardOffersComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              {
                path: 'boxes',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/a-hot-boxes-offers/a-hot-boxes-offers.component'
                  ).then((c) => c.AHotBoxesOffersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'boxes-index', pathMatch: 'full' },
                  {
                    path: 'boxes-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/a-hot-boxes-offers/a-hot-boxes-all/a-hot-boxes-all.component'
                      ).then((c) => c.AHotBoxesAllComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'boxes-details/:id',
                    resolve: { boxes: hotBoxesDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/a-hot-boxes-offers/b-hot-boxes-details/b-hot-boxes-details.component'
                      ).then((c) => c.BHotBoxesDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'boxes-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/a-hot-boxes-offers/c-hot-boxes-add/c-hot-boxes-add.component'
                      ).then((c) => c.CHotBoxesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'boxes-edit/:id',
                    resolve: { boxes: hotBoxesDetailsResolver },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/a-hot-boxes-offers/c-hot-boxes-add/c-hot-boxes-add.component'
                      ).then((c) => c.CHotBoxesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              {
                path: 'combo',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/b-combo-boxes-offers.component'
                  ).then((c) => c.BComboBoxesOffersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'combo-index', pathMatch: 'full' },
                  {
                    path: 'combo-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/a-combo-boxes-all/a-combo-boxes-all.component'
                      ).then((c) => c.AComboBoxesAllComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'combo-details/:id',
                    resolve: { comboOffers: comboDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/b-combo-boxes-details/b-combo-boxes-details.component'
                      ).then((c) => c.BComboBoxesDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'combo-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/c-combo-boxes-add/c-combo-boxes-add.component'
                      ).then((c) => c.CComboBoxesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: { category: productsCategoriesResolver },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'combo-edit/:id',
                    resolve: {
                      comboOffers: comboDetailsResolver,
                      category: productsCategoriesResolver,
                    },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/c-combo-boxes-add/c-combo-boxes-add.component'
                      ).then((c) => c.CComboBoxesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'limits-details/:id',
                    resolve: {
                      category: productsCategoriesResolver,
                      products: comboProductsResolver,
                    },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/d-combo-boxes-limits-details/d-combo-boxes-limits-details.component'
                      ).then((c) => c.DComboBoxesLimitsDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'limits-add/:id',
                    resolve: {
                      comboOffers: comboDetailsResolver,
                      category: productsCategoriesResolver,
                      products: comboProductsResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/e-combo-boxes-limits-add/e-combo-boxes-limits-add.component'
                      ).then((c) => c.EComboBoxesLimitsAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'limits-edit/:id',
                    resolve: {
                      comboOffers: comboDetailsResolver,
                      category: productsCategoriesResolver,
                      products: comboProductsResolver,
                    },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/b-combo-boxes-offers/e-combo-boxes-limits-add/e-combo-boxes-limits-add.component'
                      ).then((c) => c.EComboBoxesLimitsAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              {
                path: 'coupons',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/d-coupon/d-coupon.component'
                  ).then((c) => c.DCouponComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'coupons-index', pathMatch: 'full' },
                  {
                    path: 'coupons-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/d-coupon/a-all-coupon/a-all-coupon.component'
                      ).then((c) => c.AAllCouponComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'coupons-details/:id',
                    resolve: { coupon: couponDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/d-coupon/b-coupon-details/b-coupon-details.component'
                      ).then((c) => c.BCouponDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'coupons-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/d-coupon/c-coupon-add/c-coupon-add.component'
                      ).then((c) => c.CCouponAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'coupons-edit/:id',
                    resolve: { coupon: couponDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/d-coupon/c-coupon-add/c-coupon-add.component'
                      ).then((c) => c.CCouponAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              /* Vouchers */
              {
                path: 'vouchers',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/voucher.component'
                  ).then((c) => c.VoucherComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'vouchers-index', pathMatch: 'full' },
                  {
                    path: 'vouchers-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/a-all-voucher/a-all-voucher.component'
                      ).then((c) => c.AAllVoucherComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'vouchers-details/:id',
                    resolve: { voucher: voucherDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/b-details-voucher/b-details-voucher.component'
                      ).then((c) => c.BDetailsVoucherComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'vouchers-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/b-voucher-id/b-voucher-id.component'
                      ).then((c) => c.BVoucherIdComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'vouchers-edit/:id',
                    resolve: { voucher: voucherDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/voucher/b-voucher-id/b-voucher-id.component'
                      ).then((c) => c.BVoucherIdComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              /* Promo Codes */
              {
                path: 'promo-codes',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/promo-code.component'
                  ).then((c) => c.PromoCodeComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'promo-codes-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'promo-codes-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/a-all-promo-code/a-promo-code.component'
                      ).then((c) => c.AAllPromoCodeComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'promo-codes-details/:id',
                    resolve: { promoCode: promoCodeDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/b-details-promo-code/b-details-promo-code.component'
                      ).then((c) => c.BDetailsPromoCodeComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'promo-codes-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/b-promo-code-id/b-promo-code-id.component'
                      ).then((c) => c.BPromoCodeIdComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'promo-codes-edit/:id',
                    resolve: { promoCode: promoCodeDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/promocode/b-promo-code-id/b-promo-code-id.component'
                      ).then((c) => c.BPromoCodeIdComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              // happy-hours
              {
                path: 'happy-hours',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/b-dashboard-offers/c-happy-hours/a-happy-hours.component'
                  ).then((c) => c.AHappyHoursComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'happy-hours-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'happy-hours-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/c-happy-hours/a-all-happy-hours/a-all-happy-hours.component'
                      ).then((c) => c.AAllHappyHoursComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'happy-hours-edit/:id',
                    resolve: { happyHours: HappyHoursEditResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/b-dashboard-offers/c-happy-hours/b-happy-hours-edit/b-happy-hours-edit.component'
                      ).then((c) => c.BHappyHoursEditAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
            ],
          },
          // menu
          {
            path: 'menu',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/c-dashboard-menu/c-dashboard-menu.component'
              ).then((c) => c.CDashboardMenuComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            runGuardsAndResolvers: 'always',
            children: [
              // categories
              {
                path: 'categories',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/c-dashboard-menu/a-categories/a-categories.component'
                  ).then((c) => c.ACategoriesComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  {
                    path: '',
                    redirectTo: 'categories-index',
                    pathMatch: 'full',
                  },
                  {
                    path: 'categories-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/a-categories/a-all-categories/a-all-categories.component'
                      ).then((c) => c.AAllCategoriesComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'categories-details/:id',
                    resolve: { category: categoryDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/a-categories/b-category-details/b-category-details.component'
                      ).then((c) => c.BCategoryDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'categories-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/a-categories/d-category-add/d-category-add.component'
                      ).then((c) => c.DCategoryAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'categories-edit/:id',
                    resolve: { category: categoryDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/a-categories/d-category-add/d-category-add.component'
                      ).then((c) => c.DCategoryAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              
              // products
              {
                path: 'products',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/b-products.component'
                  ).then((c) => c.BProductsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                runGuardsAndResolvers: 'always',
                children: [
                  { path: '', redirectTo: 'products-index', pathMatch: 'full' },
                  {
                    path: 'products-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/a-all-products/a-all-products.component'
                      )
                        .then()
                        .then((c) => c.AAllProductsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'products-details/:id',
                    resolve: { products: productDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/b-products-details/b-products-details.component'
                      )
                        .then()
                        .then((c) => c.BProductsDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'products-pice-price/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/d-products-pice-price/d-products-pice-price.component'
                      )
                        .then()
                        .then((c) => c.DProductsPicePriceComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'products-pice-price-add/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/f-pice-price-add/f-pice-price-add.component'
                      )
                        .then()
                        .then((c) => c.FPicePriceAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: { products: productDetailsResolver },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'products-pice-price-edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/f-pice-price-add/f-pice-price-add.component'
                      )
                        .then()
                        .then((c) => c.FPicePriceAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: { products: productDetailsResolver },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'products-choice/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/e-products-choices/e-products-choices.component'
                      )
                        .then()
                        .then((c) => c.EProductsChoicesComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'products-choice-add/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/g-choices-add/g-choices-add.component'
                      )
                        .then()
                        .then((c) => c.GChoicesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: {
                      categories: productsCategoriesResolver,
                      products: productDetailsResolver,
                    },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'products-choice-edit/:id',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/g-choices-add/g-choices-add.component'
                      )
                        .then()
                        .then((c) => c.GChoicesAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: {
                      products: productDetailsResolver,
                      categories: productsCategoriesResolver,
                    },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'products-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/c-products-add/c-products-add.component'
                      )
                        .then()
                        .then((c) => c.CProductsAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                    resolve: { categories: productsCategoriesResolver },
                    runGuardsAndResolvers: 'always',
                  },
                  {
                    path: 'products-edit/:id',
                    resolve: {
                      products: productDetailsResolver,
                      categories: productsCategoriesResolver,
                    },
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/c-dashboard-menu/b-products/h-products-edit/h-products-edit.component'
                      )
                        .then()
                        .then((c) => c.HProductsEditComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
            ],
          },
          // sub-locations
          {
            path: 'sub-locations',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/h-sub-locations/h-sub-locations.component'
              ).then((c) => c.HSubLocationsComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              {
                path: '',
                redirectTo: 'sub-locations-index',
                pathMatch: 'full',
              },
              {
                path: 'sub-locations-index',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/h-sub-locations/a-sub-locations-all/a-sub-locations-all.component'
                  ).then((c) => c.ASubLocationsAllComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'sub-locations-details/:id',
                resolve: { subLocations: subLocationsResolver },
                runGuardsAndResolvers: 'always',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/h-sub-locations/b-sub-locations-details/b-sub-locations-details.component'
                  ).then((c) => c.BSubLocationsDetailsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'sub-locations-add',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/h-sub-locations/d-sub-locations-add/d-sub-locations-add.component'
                  ).then((c) => c.DSubLocationsAddComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'sub-locations-edit/:id',
                resolve: { subLocations: subLocationsResolver },
                runGuardsAndResolvers: 'always',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/h-sub-locations/d-sub-locations-add/d-sub-locations-add.component'
                  ).then((c) => c.DSubLocationsAddComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
            ],
          },
          // orders
          {
            path: 'orders',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/d-dashboard-orders/d-dashboard-orders.component'
              ).then((c) => c.DDashboardOrdersComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              { path: '', redirectTo: 'orders', pathMatch: 'full' },
              {
                path: 'orders',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/d-dashboard-orders/a-orders/a-orders.component'
                  ).then((c) => c.AOrdersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                resolve: { branches: allBranchesResolver },
                runGuardsAndResolvers: 'always',
              },
              {
                path: 'history',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/d-dashboard-orders/b-orders-history/b-orders-history.component'
                  ).then((c) => c.BOrdersHistoryComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                resolve: { branches: allBranchesResolver },
                runGuardsAndResolvers: 'always',
              },
              {
                path: 'order-details/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/d-dashboard-orders/c-orders-details/c-orders-details.component'
                  ).then((c) => c.COrdersDetailsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                resolve: {
                  orderDetails: orderDetailsResolver,
                  branches: allBranchesResolver,
                },
                runGuardsAndResolvers: 'always',
              },
              {
                path: 'order-history-details/:id',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/d-dashboard-orders/c-orders-details/c-orders-details.component'
                  ).then((c) => c.COrdersDetailsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                resolve: {
                  orderDetails: orderDetailsResolver,
                  branches: allBranchesResolver,
                },
                runGuardsAndResolvers: 'always',
              },
            ],
          },
          // users
          {
            path: 'users',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/e-dashboard-users/e-dashboard-users.component'
              ).then((c) => c.EDashboardUsersComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              { path: '', redirectTo: 'users-index', pathMatch: 'full' },
              {
                path: 'users-index',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/e-dashboard-users/a-all-users/a-all-users.component'
                  ).then((c) => c.AAllUsersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'users-orders/:id',
                resolve: { userData: usersDetailsResolver },
                runGuardsAndResolvers: 'always',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/e-dashboard-users/b-user-orders/b-user-orders.component'
                  ).then((c) => c.BUserOrdersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'users-address/:id',
                resolve: {
                  userData: usersDetailsResolver,
                  LocationsData: usersAddressDataResolver,
                },
                runGuardsAndResolvers: 'always',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/e-dashboard-users/c-user-addresses/c-user-addresses.component'
                  ).then((c) => c.CUserAddressesComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
            ],
          },
          // pages
          {
            path: 'pages',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/f-dashboard-pages/f-dashboard-pages.component'
              ).then((c) => c.FDashboardPagesComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              {
                path: 'sliders',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/f-dashboard-pages/d-sliders/d-sliders.component'
                  ).then((c) => c.DSlidersComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'sliders-index', pathMatch: 'full' },
                  {
                    path: 'sliders-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/d-sliders/a-all-sliders/a-all-sliders.component'
                      ).then((c) => c.AAllSlidersComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'sliders-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/d-sliders/c-sliders-add/c-sliders-add.component'
                      ).then((c) => c.CSlidersAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'sliders-edit/:id',
                    resolve: { slider: sliderDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/d-sliders/c-sliders-add/c-sliders-add.component'
                      ).then((c) => c.CSlidersAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              {
                path: 'about-us',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/f-dashboard-pages/a-about-us/a-about-us.component'
                  ).then((c) => c.AAboutUsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'privacy-policy',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/f-dashboard-pages/b-privacy-policy/b-privacy-policy.component'
                  ).then((c) => c.BPrivacyPolicyComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'tutorial',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/f-dashboard-pages/c-tutorial/c-tutorial.component'
                  ).then((c) => c.CTutorialComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'tutorial-index', pathMatch: 'full' },
                  {
                    path: 'tutorial-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/c-tutorial/a-all-tutorial/a-all-tutorial.component'
                      ).then((c) => c.AAllTutorialComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'tutorial-details/:id',
                    resolve: { tutorial: tutorialDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/c-tutorial/b-tutorial-details/b-tutorial-details.component'
                      ).then((c) => c.BTutorialDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'tutorial-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/c-tutorial/c-tutorial-add/c-tutorial-add.component'
                      ).then((c) => c.CTutorialAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'tutorial-edit/:id',
                    resolve: { tutorial: tutorialDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/f-dashboard-pages/c-tutorial/c-tutorial-add/c-tutorial-add.component'
                      ).then((c) => c.CTutorialAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
            ],
          },
          // contact-us
          {
            path: 'contact-us',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/g-contact-us/g-contact-us.component'
              ).then((c) => c.GContactUsComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
            children: [
              {
                path: 'social-links',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/g-contact-us/a-social-media-links/a-social-media-links.component'
                  ).then((c) => c.ASocialMediaLinksComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'branches',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/g-contact-us/b-branch/b-branch.component'
                  ).then((c) => c.BBranchComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
                children: [
                  { path: '', redirectTo: 'branches-index', pathMatch: 'full' },
                  {
                    path: 'branches-index',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/g-contact-us/b-branch/c-all-branches/c-all-branches.component'
                      ).then((c) => c.CAllBranchesComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'branches-details/:id',
                    resolve: { branch: branchDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/g-contact-us/b-branch/a-branch-details/a-branch-details.component'
                      ).then((c) => c.ABranchDetailsComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'branches-add',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/g-contact-us/b-branch/b-branch-add/b-branch-add.component'
                      ).then((c) => c.BBranchAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                  {
                    path: 'branches-edit/:id',
                    resolve: { branch: branchDetailsResolver },
                    runGuardsAndResolvers: 'always',
                    loadComponent: () =>
                      import(
                        './pages/dashboard/dashboard-pages/g-contact-us/b-branch/b-branch-add/b-branch-add.component'
                      ).then((c) => c.BBranchAddComponent),
                    data: {
                      title: 'Zi Sushi',
                      description: 'Dashboard Page',
                    },
                  },
                ],
              },
              {
                path: 'messages',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/g-contact-us/d-messages/d-messages.component'
                  ).then((c) => c.DMessagesComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
              {
                path: 'messages/:id',
                resolve: { message: messageDetailsResolver },
                runGuardsAndResolvers: 'always',
                loadComponent: () =>
                  import(
                    './pages/dashboard/dashboard-pages/g-contact-us/d-messages/message-details/message-details.component'
                  ).then((c) => c.MessageDetailsComponent),
                data: {
                  title: 'Zi Sushi',
                  description: 'Dashboard Page',
                },
              },
            ],
          },
          {
            path: 'notifications',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/l-notifications/l-notifications.component'
              ).then((c) => c.LNotificationsComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
          },
          {
            path: 'app-version',
            loadComponent: () =>
              import(
                './pages/dashboard/dashboard-pages/m-app-version/m-app-version.component'
              ).then((c) => c.MAppVersionComponent),
            data: {
              title: 'Zi Sushi',
              description: 'Dashboard Page',
            },
          },
        ],
      },
    ],
  },

  /** path: ***/
  {
    path: 'internet-error',
    component: JInternetConnectionComponent,
    data: {
      title: 'Zi Sushi',
      description: 'Dashboard Page',
    },
  },

  // Not Found Page
  {
    path: '**',
    loadComponent: () =>
      import('./pages/main/not-found/not-found.component').then(
        (e) => e.NotFoundComponent
      ),
    data: { title: 'Not Found Page' },
  },
];
