import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { timer } from 'rxjs';
import { FlowbiteService } from './core/services/core/flowbite.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  providers: [],
})
export class AppComponent {
  title = 'zi-sushi';

  ngxSpinnerService = inject(NgxSpinnerService);
  Title = inject(Title);
  Meta = inject(Meta);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  flowbiteService = inject(FlowbiteService);
  _HttpClient = inject(HttpClient);

  constructor() {
    this.HandleMetaTags();
  }
  isBrowser: boolean = false;
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.flowbiteService.loadFlowbite((flowbite) => {
        initFlowbite();
      });
    }

    this.ngxSpinnerService.show('mainLoader');
    if (typeof window !== 'undefined') {
      this.isBrowser = true;
    }
  }
  @HostListener('window:load')
  onWindowLoad() {
    timer(3000).subscribe(() => this.ngxSpinnerService.hide('mainLoader'));
  }
  HandleMetaTags(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Get the current route snapshot from root to the last child route
        let route = this.router.routerState.snapshot.root;

        // Traverse through the route tree to the deepest child
        while (route.firstChild) {
          route = route.firstChild;
        }

        // Get the title and description from the final route data
        const title = route.data['title'] || 'Default Title';
        const description = route.data['description'] || 'Default Description';

        // Set the page title and meta description dynamically
        this.Title.setTitle(title);
        this.Meta.updateTag({ name: 'description', content: description });
      }
    });
  }
}
