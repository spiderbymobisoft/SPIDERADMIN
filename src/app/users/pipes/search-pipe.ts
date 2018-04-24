import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SearchPipe'
})
export class SearchPipe implements PipeTransform {
  transform(value, args?): Array<any> {
    let searchText = new RegExp(args, 'ig');
    if (value) {
      return value.filter(record => {
        return record.firstname.search(searchText) !== -1 || record.lastname.search(searchText) !== -1 || record.organisation.search(searchText) !== -1 ;
      });
    }
  }
}
