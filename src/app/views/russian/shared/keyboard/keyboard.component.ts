import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html'
})
export class KeyboardComponent {

  @Output()
  public keyEmitter: EventEmitter<string> = new EventEmitter<string>();

  public russianKeyboard: Array<Array<string>> = [
    ["ё"],
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"]
  ];

  constructor() { }

  public onKeyboard(letter: string): void {
    this.keyEmitter.emit(letter);
  }

}
