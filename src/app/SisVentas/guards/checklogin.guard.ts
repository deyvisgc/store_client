import { Route } from '@angular/compiler/src/core';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthenticationService } from '../service/Authentication/authentication.service';
@Injectable({
  providedIn: 'root'
})
export class CheckloginGuard implements CanActivate {
  roles: any;
  SecretRol = 'K56QSxGeKImwBRmiY';
  constructor( private authser: AuthenticationService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return this.authser.isLoggedInUser.pipe(take(1), map((isLoggedInUser: boolean) => !isLoggedInUser));
      if (this.authser.isLoggedInUser()) {
        // logged in so return true
        this.roles = localStorage.getItem('rol_name');
        return this.checkUserLogin(next);
        const RRDS = this.authser.CryptoJSAesDecrypt(this.SecretRol, this.roles);
        const RRDSTF = next.data.RRDS.include(RRDS);
        if (RRDSTF === false) {
          this.router.navigate(['/']);
          return false;
        } else {
          return true;
        }
      }
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
  checkUserLogin(route: ActivatedRouteSnapshot): boolean {
    if (this.authser.isLoggedInUser()) {
      const rolNname = localStorage.getItem('rol_name');

      if (rolNname === typeof undefined || rolNname === '' || rolNname === null) {
        this.router.navigate(['/']);
        return false;
      }
      this.roles = localStorage.getItem('rol_name');
      const userRole = this.authser.CryptoJSAesDecrypt(this.SecretRol, this.roles);
      console.log('userRole', userRole);
      if (route.data.role && route.data.role.indexOf(userRole) === -1) {
        alert('No tiene los permisos para ingresar a esta pantalla');
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    this.router.navigate(['/']);
    return false;
  }
}
