import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(array: Array<unknown>, key: string): Array<unknown> {
    if (!array) return [];
    const sortedList = _.sortBy(array, [key]);
    return sortedList;
  }
}
