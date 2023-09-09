import { ChangeDetectorRef, Component } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DataService, Cita, Doctor } from '../services/data.service';
import { ModalPage } from '../modal/modal.page';
import { Auth, authState } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { race } from 'rxjs';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
})
export class CitasPage {
  Citas: Cita[] = [];
  Doctor: { nombre_doctor: string } = { nombre_doctor: '' };
  constructor(
    private auth: Auth,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private dataService: DataService,
    private cd: ChangeDetectorRef,
    private alertCtrl: AlertController,
    private afAuth: Auth,
    private firestore: Firestore,
    private modalCtrl: ModalController
  ) {
    this.dataService.getCitas().subscribe((res) => {
      this.Citas = res;
      this.cd.detectChanges();
    });
  }

  async addCita() {
    const user = this.auth.currentUser;

    if (user) {
      // Check the UID and set the nombre_doctor accordingly
      if (user.uid === 'kLuvkGBfVNUSKQ61H2wUpTYFAxF2') {
        this.Doctor.nombre_doctor = 'Miguel Solis';
      } else if (user.uid === '6oDQ9nYioHZNdpHwWDqeQ0awhd93') {
        this.Doctor.nombre_doctor = 'Jose de Leon';
      } else if (user.uid === 'GtG0vKIqZEhq0jDUYiNPXQmYke63') {
        this.Doctor.nombre_doctor = 'Jazmin Treto';
      } else if (user.uid === '4ian9QEBzUNteymeVr2cqlScwHr2') {
        this.Doctor.nombre_doctor = 'Alfredo Alvarez';
      }
    }
    const alert = await this.alertCtrl.create({
      header: 'Agregar Nueva Cita',
      inputs: [
        {
          name: 'nombre_evento',
          placeholder: 'Nombre del evento',
          type: 'text',
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
          value: '',
        },
        {
          name: 'nombre_doctor',
          placeholder: 'Nombre del doctor',
          type: 'text',
          value: this.Doctor.nombre_doctor,
        },
        {
          name: 'correo_electronico',
          placeholder: 'Correo Electronico',
          type: 'text',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: async (res) => {
            const user = await this.afAuth.currentUser;
            if (user) {
              const selectedDate = new Date(res.fecha + ' ' + res.hora);
              const currentDate = new Date();

              // Verificar si la fecha seleccionada es posterior a la fecha actual
              if (selectedDate < currentDate) {
                // Mostrar un mensaje de error
                console.log('No puedes registrar eventos en fechas pasadas.');
              } else {
                const citaData = {
                  nombre_evento: res.nombre_evento,
                  fecha: res.fecha,
                  hora: res.hora,
                  nombre_paciente: res.nombre_paciente,
                  nombre_doctor: res.nombre_doctor,
                  correo_electronico: res.correo_electronico,
                  doctor_id: user.uid, // Guarda el UID del usuario en la cita
                };
                //Check if cita already exists
                const notesRef = query(
                  collection(this.firestore, 'Citas'),
                  where('fecha', '==', res.fecha),
                  where('hora', '==', res.hora)
                );
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
                  console.log('Cita already exists at the same date and time.');
                } else {
                  // Add cita if it doesn't exist
                  this.dataService.addCita(citaData);
                }
              } 
            } else {
              // Handle the case when no user is authenticated
              console.log('No user is authenticated.');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async openCita(Cita: Cita) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: Cita.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.8,
    });

    await modal.present();
  }
}
