import { Component, OnInit } from '@angular/core';
import { GridSettings } from 'radweb';
import { Families } from '../models';
import { AuthService } from '../auth/auth-service';

@Component({
  selector: 'app-asign-family',
  templateUrl: './asign-family.component.html',
  styleUrls: ['./asign-family.component.scss']
})
export class AsignFamilyComponent implements OnInit {


  families = new GridSettings(new Families(), {
    get: {
      where: f => f.courier.isEqualTo(this.auth.auth.info.helperId),
      limit:9999
    }
  });
  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.families.getRecords();
  }


}