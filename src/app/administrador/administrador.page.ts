import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, Cita } from '../services/data.service';
import { ModalPage } from '../modal/modal.page';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';
import { AuthService} from '../services/auth.service';
import { ToastController } from '@ionic/angular';
@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage  {
  Citas: Cita[] = [];
  
  constructor( private toastCtrl: ToastController, private authService: AuthService, private dataService: DataService, private cd: ChangeDetectorRef, private alertCtrl: AlertController,private afAuth: Auth, private firestore: Firestore, private modalCtrl: ModalController) {
    this.dataService.getdirector().subscribe(res => {
      this.Citas = res;
      this.cd.detectChanges();
    });
  }

  async addCita() {
    
    const alert = await this.alertCtrl.create({
      header: 'Agregar Nueva Cita',
      inputs: [
        {
          name: 'nombre_evento',
          placeholder: 'Nombre del evento',
          type: 'text'
        },
        {
          name: 'fecha',
          placeholder: 'Fecha',
          type: 'date',
        },
        {
          name: 'hora',
          placeholder: 'Hora',
          type: 'time',
        },
        {
          name: 'nombre_paciente',
          placeholder: 'Nombre del paciente',
          type: 'text',
          value: ''
        },
        {
          name: 'nombre_doctor',
          placeholder: 'Nombre del doctor',
          type: 'text'
        
          
        },
        {
          name: 'correo_electronico',
          placeholder: 'Correo Electronico',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Agregar',
          handler: async res => {
            const user = await this.afAuth.currentUser;
            if (user) {
              const citaData = {
                nombre_evento: res.nombre_evento,
                fecha: res.fecha,
                hora: res.hora,
                nombre_paciente: res.nombre_paciente,
                nombre_doctor: res.nombre_doctor,
                correo_electronico: res.correo_electronico,
                doctor_id: user.uid  // Guarda el UID del usuario en la cita
              };
  
             //Check if cita already exists
             const notesRef = query(collection(this.firestore, 'Citas'),where('fecha', '==', res.fecha),where( 'hora', '==', res.hora))
    const querySnapshot = await getDocs(notesRef);
            
              querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
            if (querySnapshot.size > 0) {
              // Show an error message to the user
              const toast = await this.toastCtrl.create({
                message: 'Ya existe una cita agregada para esa fecha y hora.',
                duration: 3000, // Display for 3 seconds
                position: 'top', // You can change the position as needed
                color: 'danger', // You can change the color as needed
              });
              await toast.present();
              console.log("Cita already exists at the same date and time.");
            } else {
              // Add cita if it doesn't exist
              this.dataService.addCita(citaData);
            }
          } else {
            // Handle the case when no user is authenticated
            console.log("No user is authenticated.");
          }
        }
      }
    ]
  });

  await alert.present();
}

  async openCita(Cita: Cita) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: Cita.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8
    });

    await modal.present();
  }
}
