import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DeleteService } from '../services/http/crud/delete.services';
import { RetrieveService } from '../services/http/crud/retrieve.services';
import { SharedServices } from '../services/shared/shared.services';

declare var jQuery: any;
declare var swal: any;

@Component({
  selector: '[entity]',
  templateUrl: './entity.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./entity.style.scss']
})
export class Entity implements OnInit {
  entityRecord: any;

  constructor(
    private router: Router, private ss: SharedServices
  ) {

  }

  ngOnInit(): void {
   this.entityRecord = this.ss.getRecord('entity');
  }

  deleteEntity(id){
    
  }


}
