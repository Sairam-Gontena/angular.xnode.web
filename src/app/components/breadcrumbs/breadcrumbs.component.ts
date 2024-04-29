import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';

@Component({
  selector: 'xnode-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent {
  @Input() items: MenuItem[] | undefined;
  @Input() highLightColor: string = ''
  @Output() changeEvent = new EventEmitter<{ event: any }>();

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.items = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  ngOnInit() { }

  private createBreadcrumbs(route: ActivatedRoute, routelink: string = '', breadcrumbs: MenuItem[] = []): any {
    const children: ActivatedRoute[] = route.children;
    if (children.length === 0) {
      return breadcrumbs;
    }
    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        routelink += `/${routeURL}`;
      }
      const label = child.snapshot.data.breadcrumb;
      if (label) {
        breadcrumbs.push({ label, routelink });
      }
      return this.createBreadcrumbs(child, routelink, breadcrumbs);
    }
  }

  //on change event handler
  onChangeHandler(eventData: any) {
    const eventDetail: any = { eventType: 'breadcrum', eventData: eventData.item }
    this.changeEvent.emit(eventDetail);
  }

}
