import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: Array<unknown>, reverse: boolean): Array<unknown> {
    if (!value) return [];
    const sortedList = _.sortBy(value, ['value']);
    return reverse ? sortedList.reverse() : sortedList;
  }
}
