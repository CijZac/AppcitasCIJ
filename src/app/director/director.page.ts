import { Component, OnInit } from '@angular/core';
import { DataService, Cita } from '../services/data.service';

@Component({
  selector: 'app-director',
  templateUrl: './director.page.html',
  styleUrls: ['./director.page.scss'],
})
export class DirectorPage implements OnInit {
  Citas: Cita[] = [];
  constructor( private dataService: DataService) { 
    this.dataService.getdirector().subscribe(res => {
      this.Citas = res;
 
    });
  }

  ngOnInit() {
  }

}
