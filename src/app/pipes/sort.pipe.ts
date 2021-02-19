import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: Array<unknown>, key: string): Array<unknown> {
    if (!value) return [];
    const sortedList = _.sortBy(value, [key]);
    return sortedList;
  }
}
