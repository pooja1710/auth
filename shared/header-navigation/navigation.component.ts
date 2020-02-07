import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  public showSearch = false;

  constructor(private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.getCurrentUser()
  }

  userDetail: any;
  img_url: any;
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

  logout() {
    this.userService.clientMasterId = 0;
    this.userService.clearSession();
    window.localStorage.removeItem('clientMasterId');
    window.localStorage.removeItem('clientMasterType');
    window.localStorage.removeItem('hspName');
    window.localStorage.clear();
    this.router.navigate(['/login']);
  }
}


