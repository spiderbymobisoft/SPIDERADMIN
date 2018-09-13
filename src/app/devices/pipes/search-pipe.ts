import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SearchPipe'
})
export class SearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(data => {
        if (data) {
          return data.personal.email.search(searchText) !== -1 || data.organisation.email.search(searchText) !== -1;
        }
      });
    }
  }
}
