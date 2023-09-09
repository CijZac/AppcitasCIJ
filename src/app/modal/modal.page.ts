import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Firestore, collection, getDocs, query, where } from '@angular/fire/firestore';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    /**
     
Date will be enabled if it is not
Sunday or Saturday*/
return utcDay !== 0 && utcDay !== 6;
};
  @Input() id: string | undefined;
  Cita: any;
 

  constructor(private firestore: Firestore,   private dataService: DataService, private modalCtrl: ModalController, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.dataService.getCitaById(this.id).subscribe(res => {
      this.Cita = res;
    });
  }

  async deleteNote() {
    await this.dataService.deleteCita(this.Cita)
    this.modalCtrl.dismiss();
  }

  async updateNote() {
    const notesRef = query(collection(this.firestore, 'Citas'),where('fecha', '==', this.Cita.fecha),where( 'hora', '==', this.Cita.hora))
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
              await this.dataService.updateCitas(this.Cita);
    const toast = await this.toastCtrl.create({
      message: 'Cita Actualizada!.',
      duration: 2000
    });
    toast.present();
              // Add cita if it doesn't exist
          
            }




            
    
  }
}