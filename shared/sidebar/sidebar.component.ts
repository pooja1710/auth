import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import { ROUTES } from './menu-items';
import { RouteInfo } from './sidebar.metadata';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarConfigInterface,
  PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
  import { UserService } from '../../shared/services/user.service';
  import { environment } from '../../../environments/environment'
declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public config: PerfectScrollbarConfigInterface = {};
  @ViewChild(PerfectScrollbarComponent) componentRef?: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective) directiveRef?: PerfectScrollbarDirective;
  isCollapsed = true;
  isCollapsed1 = true;
  isCollapsed3 = true;
  isCollapsed4 = true;
  isCollapsed2 = true;
  isCollapsed6 = true;
  isCollapsed7 = true;
  isCollapsed8 = true;

  showMenu = '';
  showSubMenu = '';
  public sidebarnavItems: any[];
  // this is for the open close
  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  // End open close
  ngOnInit() {
    this.getCurrentUser()
    this.sidebarnavItems = ROUTES.filter(sidebarnavItem => sidebarnavItem);
  }

  userDetail:any;
  img_url:any;
  apiurl: any = environment.api_url;
  getCurrentUser() {
    this.userService.currentUser.subscribe(
        (userData) => {
            if (userData)
                this.userDetail = userData;
            if (this.userDetail.item.hostModel == "CLOUD")
                this.img_url = environment.cloudeImageURL
            else
                this.img_url = environment.vmImageURL

            console.log(this.userDetail)
        }
    )
}
}
