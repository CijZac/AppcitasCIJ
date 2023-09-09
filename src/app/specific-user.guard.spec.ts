import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';
import { Auth, authInstance$ } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root'
})
export class SpecificUserGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private auth: Auth) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = this.auth.currentUser; // Obtener usuario autenticado desde tu servicio de autenticación
    const desiredUID = 'ct9NsddUXMgmUGrmljVKFGOOhui2'; // UID deseado

    if (user && user.uid === desiredUID) {
      return true; // Usuario autenticado con el UID correcto, permitir acceso
    } else {
      this.router.navigate(['/no-access']); // Redirigir a una página de acceso denegado si el UID no coincide
      return false;
    }
  }
}
