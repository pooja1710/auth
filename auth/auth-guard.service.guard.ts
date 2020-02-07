import { Injectable,AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { User } from '../shared/models/user.model';
import { UserService } from '../shared/services/user.service';
class Permissions {
  canGoToRoute(user: User, id: string): boolean {
    return true;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private userService: UserService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.userService.isAuthenticated.take(1);

  }
  
}
