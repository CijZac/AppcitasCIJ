import { Injectable } from '@angular/core';
import { Firestore, doc, addDoc, docData, collection, collectionData, deleteDoc, updateDoc, Timestamp, query, where } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { AuthService, user} from '../services/auth.service';
// Modelo
export interface Cita {
  id?: string;
 nombre_evento: string;
 fecha: Timestamp;
 hora: string;
 nombre_paciente: string;
 nombre_doctor: string;
 correo_electronico: string;
 doctor_id: string;
}
export interface Doctor {
  id?: string;
 nombre: string;
 doctor_uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  checkIfCitaExists(citaData: { nombre_evento: any; fecha: any; hora: any; nombre_paciente: any; nombre_doctor: any; correo_electronico: any; doctor_id: string; }) {
    throw new Error('Method not implemented.');
  }

  constructor(private authService: AuthService, private firestore: Firestore,  private auth: Auth) { }
  

  // Extrae los registros de la base de datos
  getCitas(): Observable<Cita[]> {
    const user = this.auth.currentUser;
    const userUID = user?.uid;
    console.log(userUID);

    const notesRef = query(collection(this.firestore, 'Citas'), where("doctor_id", "==", userUID));
    return collectionData(notesRef, { idField: 'id' }) as Observable<Cita[]>;
  }
  getdirector(): Observable<Cita[]> {
    

    const notesRef = collection(this.firestore, 'Citas');
    return collectionData(notesRef, { idField: 'id' }) as Observable<Cita[]>;
  }

  

 

  
  // Extrae una cita mediante el id
  getCitaById(id: any): Observable<Cita> {
    const CitaDocRef = doc(this.firestore, `Citas/${id}`);
    return docData(CitaDocRef, { idField: 'id' }) as Observable<Cita>;
  }

  // Agrega una cita
  addCita(Cita: Cita) {
    const CitasRef = collection(this.firestore, 'Citas');
    return addDoc(CitasRef, Cita);
  }

  // Elimina una cita
  deleteCita(Cita: Cita) {
    const CitaDocRef = doc(this.firestore, `Citas/${Cita.id}`);
    return deleteDoc(CitaDocRef);
  }

  // Actualiza una cita
  updateCitas(Cita: Cita) {
    const CitaDocRef = doc(this.firestore, `Citas/${Cita.id}`);
    return updateDoc(CitaDocRef, { nombre_evento: Cita.nombre_evento, fecha: Cita.fecha, hora: Cita.hora, nombre_paciente: Cita.nombre_paciente,nombre_doctor: Cita.nombre_doctor, correo_electronico: Cita.correo_electronico });
  }
}