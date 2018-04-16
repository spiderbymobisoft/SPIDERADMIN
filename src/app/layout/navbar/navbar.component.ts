import { Component, EventEmitter, OnInit, ElementRef, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../app.config';
import { EventService } from '../../services/events/event.services';
import { AuthenticationService } from '../../services/http/authentication/auth.service';
import { SharedServices } from '../../services/shared/shared.services';

declare let jQuery: any;
declare var swal: any;

@Component({
  selector: '[navbar]',
  templateUrl: './navbar.template.html',
  styleUrls: ['./navbar.style.scss']
})
export class Navbar implements OnInit {
  @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
  @Output() toggleChatEvent: EventEmitter<any> = new EventEmitter();
  $el: any;
  config: any;
  router: Router;

  public user : any;
  private access : string = sessionStorage.getItem('__access__');
  public personal : any = {
    firstname : '',
    lastname : '',
    avatar: 'assets/img/people/a5.jpg'
  }

  public lightSwitch : boolean = false;
  
  constructor(es: EventService, private auth: AuthenticationService,
    el: ElementRef, config: AppConfig, router: Router, private ss: SharedServices) {

    es._avatarEvent.subscribe(data=>{
      this.personal.avatar= data;
    });

    this.$el = jQuery(el.nativeElement);
    this.config = config.getConfig();
    this.router = router;
  }

  toggleSidebar(state): void {
    this.toggleSidebarEvent.emit(state);
  }

  toggleChat(): void {
    this.toggleChatEvent.emit(null);
  }

  onDashboardSearch(f): void {
    this.router.navigate(['/app', 'opportunities'], { queryParams: { search: f.value.search } });
  }

  ngOnInit(): void {
      this.lightSwitch = true;
      this.user = this.ss.USER();
       if(this.user.personal){
          this.personal = {
            firstname : this.user.personal.firstname,
            lastname : this.user.personal.lastname,
            avatar: this.user.personal.avatar
          }
        }

      this.$el.find('.input-group-addon + .form-control').on('blur focus', function(e): void {
        jQuery(this).parents('.input-group')
          [e.type === 'focus' ? 'addClass' : 'removeClass']('focus');
      });
    
  }

  logOut(){
    this.auth.logout().then((res)=>{
      swal(
        {title : 'Account Service',
        text : 'Signing out...<br/>Do come back again!',
        type : 'success',
        allowOutsideClick : false,
        allowEscapeKey : false,
        confirmButtonColor: '#0A9F62',
        confirmButtonClass: 'btn btn-md btn-primary'
      }
      ).then(()=>{
        this.router.navigate(['/login']);
      });
    });
  }
}
