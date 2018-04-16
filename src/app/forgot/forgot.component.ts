import { Component, ViewEncapsulation } from '@angular/core';
import { APIConfig  } from '../services/apiconfig/api.config';
@Component({
  selector: 'forgot',
  styleUrls: [ './forgot.style.scss' ],
  templateUrl: './forgot.template.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'forgot-page app'
  }
})
export class Forgot {
  public footerText : string;
  constructor(private apiConfig : APIConfig) {
    this.footerText = apiConfig.getFooterText();
  }
}
