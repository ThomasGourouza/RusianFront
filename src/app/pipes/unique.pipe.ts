import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unique',
})
export class UniquePipe implements PipeTransform {
  transform(array: Array<unknown>, key: string): Array<unknown> {
    const result: Array<unknown> = [];
    array.forEach((item) => {
      if (!result.map((resultItem) => resultItem[key]).includes(item[key])) {
        result.push(item);
      }
    });
    return result;
  }
}
