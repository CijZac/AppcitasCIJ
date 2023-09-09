import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router'; // Agregado para el enlace a la página de listado de citas
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isAuthenticated: boolean = false;
  isDirector: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private auth: Auth,
    private navCtrl: NavController,
    private authService: AuthService,
    private router: Router // Agregado para el enlace a la página de listado de citas
  ) {
    const user = auth.currentUser;
    if (user) {
    
      // Check the user's UID and set isDirector and isAdmin based on their UID
      const userUid = user.uid;
      if (userUid === 'ct9NsddUXMgmUGrmljVKFGOOhui2') {
        this.isDirector = true;
      } else if (userUid === 'oJWoGcKF3TdhFUgTFlPpnyufqXe2') {
        this.isAdmin = true;
      }else{
        this.isAuthenticated = true; 
      }
    }
  }
  

  async logout() {
    try {
      await this.authService.logout();
      this.navCtrl.navigateRoot('/login'); // Redireccionar a la página de inicio de sesión
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  gotoCitas() {
    this.router.navigateByUrl('/citas'); // Cambiar '/citas-list' por la ruta correcta de tu página de listado de citas
  }
  vertodas() {
    this.router.navigateByUrl('/director'); // Cambiar '/citas-list' por la ruta correcta de tu página de listado de citas
  }
  vercitas() {
    this.router.navigateByUrl('/administrador'); // Cambiar '/citas-list' por la ruta correcta de tu página de listado de citas
  }
}


