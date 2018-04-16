import { Injectable } from '@angular/core';

@Injectable()
export class PlaceholderService {

    getPlaceHolder(name): any{
        return `<div class="container">
        <main id="content" class="error-container" role="main">
          <div class="row">
            <div class="col-12 offset-0">
              <div class="error-container">
                <h1>Hi ${name}</h1>
                <p class="error-info">
                  You don't have any content to show yet. Do something awesome today! 
                  <br><b>What are you waiting for?</b>
                </p>
              </div>
            </div>
          </div>
        </main>
        </div>
        `;
    }

    getPurchaseHistoryPlaceHolder(): any{
      return `<div class="container">
      <main id="content" class="error-container" role="main">
        <div class="row">
          <div class="col-12 offset-0">
            <div class="error-container">
              <h1>Credit Purchase History</h1>
              <p class="error-info">
                You don't have any purchase history to show yet.
                <br><b>What are you waiting for?</b>
              </p>
            </div>
          </div>
        </div>
      </main>
      </div>
      `;
  }


  getGenericPlaceHolder(): any{
    return `<div class="container">
    <main id="content" class="error-container" role="main">
      <div class="row">
        <div class="col-12 offset-0">
          <div class="error-container">
            <h1>Credit Purchase History</h1>
            <p class="error-info">
              You don't have any credit purchase history. 
              <br><b>What are you waiting for?</b>
            </p>
            <!-- <p class="error-help mb">
                  If you are sure it should, search for it.
                </p> -->
            <!-- <form (ngSubmit)="searchResult()" method="get">
                  <div class="form-group">
                    <input class="form-control input-no-border" type="text" placeholder="Search Pages">
                  </div>
                  <button type="button" href="/#"  class="btn btn-inverse">
                    Search <i class="fa fa-search text-warning ml-xs"></i>
                  </button>
                </form> -->
          </div>
        </div>
      </div>
    </main>
    </div>
    `;
}


   
  }