import { animate, state, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  output,
  signal,
  SimpleChanges,
} from "@angular/core";
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from "@angular/router";
import { SidebarModule } from "primeng/sidebar";
import { Subscription, filter } from "rxjs";
import { DashboardLayoutService } from "../../../core/services/core/dashboard-layout.service";
import { DashboardMenuService } from "../../../core/services/core/dashboard-menu.service";
import { OrdersService } from "../../../core/services/g-orders/orders.service";
import { BadgeModule } from "primeng/badge";
import { InputSwitchModule } from "primeng/inputswitch";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-dashboard-menu-items",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, SidebarModule, DashboardMenuItemsComponent, BadgeModule, InputSwitchModule,FormsModule],
  templateUrl: "./dashboard-menu-items.component.html",
  styleUrl: "./dashboard-menu-items.component.scss",
  animations: [
    trigger("children", [
      state(
        "collapsed",
        style({
          height: "0",
        })
      ),
      state(
        "expanded",
        style({
          height: "*",
        })
      ),
      transition("collapsed <=> expanded", animate("400ms cubic-bezier(0.86, 0, 0.07, 1)")),
    ]),
  ],
})
export class DashboardMenuItemsComponent {
  @Input() item: any;

  @Input() index!: number;

  @Input() @HostBinding("class.layout-root-menuitem") root!: boolean;

  @Input() parentKey!: string;
  ngOnChanges(changes: SimpleChanges): void {
    if (this.item.label === "Dashboard") {
      this.item.routerLinkActiveOptions = {
        exact: true,
        queryParams: "ignored",
        matrixParams: "ignored",
        fragment: "ignored",
      };
    }
  }

  active = false;
  menuSourceSubscription: Subscription;

  menuResetSubscription: Subscription;

  key: string = "";

  OrdersService = inject(OrdersService);

  constructor(
    public layoutService: DashboardLayoutService,
    private cd: ChangeDetectorRef,
    public router: Router,
    private menuService: DashboardMenuService
  ) {
    this.menuSourceSubscription = this.menuService.menuSource$.subscribe((value) => {
      Promise.resolve(null).then(() => {
        if (value.routeEvent) {
          this.active = value.key === this.key || value.key.startsWith(this.key + "-") ? true : false;
        } else {
          if (value.key !== this.key && !value.key.startsWith(this.key + "-")) {
            this.active = false;
          }
        }
      });
    });

    this.menuResetSubscription = this.menuService.resetSource$.subscribe(() => {
      this.active = false;
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((params: any) => {
      if (this.item.routerLink) {
        this.updateActiveStateFromRoute();
      }
    });
  }

  ngOnInit() {
    this.key = this.parentKey ? this.parentKey + "-" + this.index : String(this.index);
    if (this.item.routerLink) {
      this.updateActiveStateFromRoute();
    }
  }

  updateActiveStateFromRoute() {
    let activeRoute = this.router.isActive(this.item.routerLink[0], {
      paths: "exact",
      queryParams: "ignored",
      matrixParams: "ignored",
      fragment: "ignored",
    });

    if (activeRoute) {
      this.menuService.onMenuStateChange({ key: this.key, routeEvent: true });
    }
  }

  itemClick(event: Event) {
    // avoid processing disabled items
    if (this.item.disabled) {
      event.preventDefault();
      return;
    }

    // execute command
    if (this.item.command) {
      this.item.command({ originalEvent: event, item: this.item });
    }

    // toggle active state
    if (this.item.items) {
      this.active = !this.active;
    }

    this.menuService.onMenuStateChange({ key: this.key });
  }

  get submenuAnimation() {
    return this.root ? "expanded" : this.active ? "expanded" : "collapsed";
  }

  @HostBinding("class.active-menuitem")
  get activeClass() {
    return this.active && !this.root;
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }

  ngOnDestroy() {
    if (this.menuSourceSubscription) {
      this.menuSourceSubscription.unsubscribe();
    }

    if (this.menuResetSubscription) {
      this.menuResetSubscription.unsubscribe();
    }
  }
  isActive = (router: Router): boolean => {
    const currentUrl = router.url;
    const routeLink = this.item?.routerLink?.[0] ?? "";
    return (currentUrl.startsWith(routeLink) && currentUrl !== "/dashboard") as boolean; // exclude empty/initial routes
  };

}
