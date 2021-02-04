import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextsService {

  private _french: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculin",
        example: {
          article: "Un",
          adjective: "grand",
          noun: "garçon"
        }
      },
      {
        id: 2,
        gender: "Féminin",
        example: {
          article: "Une",
          adjective: "grande",
          noun: "fille"
        }
      },
      {
        id: 3,
        gender: "Neutre",
        example: {
          article: "Un",
          adjective: "grand",
          noun: "soleil"
        }
      },
      {
        id: 4,
        gender: "Pluriel",
        example: {
          article: "Des",
          adjective: "grands",
          noun: "enfants"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "Nominatif" },
        { id: 2, value: "Acusatif" },
        { id: 3, value: "Datif" },
        { id: 4, value: "Génitif" },
        { id: 5, value: "Locatif" },
        { id: 6, value: "Instrumental" }],
      columns: [
        { id: 1, value: "Quoi" },
        { id: 2, value: "Qui" },
        { id: 3, value: "Adjectif" },
        { id: 4, value: "Nom" }]
    }
  };

  private _english: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculine",
        example: {
          article: "A",
          adjective: "big",
          noun: "boy"
        }
      },
      {
        id: 2,
        gender: "Feminine",
        example: {
          article: "A",
          adjective: "tall",
          noun: "girl"
        }
      },
      {
        id: 3,
        gender: "Neutral",
        example: {
          article: "A",
          adjective: "big",
          noun: "sun"
        }
      },
      {
        id: 4,
        gender: "Plural",
        example: {
          article: "",
          adjective: "Tall",
          noun: "kids"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "Nominative" },
        { id: 2, value: "Accusative" },
        { id: 3, value: "Dative" },
        { id: 4, value: "Genitive" },
        { id: 5, value: "Locative" },
        { id: 6, value: "Instrumental" }],
      columns: [
        { id: 1, value: "What" },
        { id: 2, value: "Who" },
        { id: 3, value: "Adjective" },
        { id: 4, value: "Noun" }]
    }
  };

  private _spanish: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculine",
        example: {
          article: "A",
          adjective: "big",
          noun: "boy"
        }
      },
      {
        id: 2,
        gender: "Feminine",
        example: {
          article: "A",
          adjective: "tall",
          noun: "girl"
        }
      },
      {
        id: 3,
        gender: "Neutral",
        example: {
          article: "A",
          adjective: "big",
          noun: "sun"
        }
      },
      {
        id: 4,
        gender: "Plural",
        example: {
          article: "",
          adjective: "Tall",
          noun: "kids"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "Nominativo" },
        { id: 2, value: "Acusativo" },
        { id: 3, value: "Dativo" },
        { id: 4, value: "Genitivo" },
        { id: 5, value: "Locativo" },
        { id: 6, value: "Instrumental" }],
      columns: [
        { id: 1, value: "Qué" },
        { id: 2, value: "Quién" },
        { id: 3, value: "Adjectivo" },
        { id: 4, value: "Sustantivo" }]
    }
  };

  private _italian: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculine",
        example: {
          article: "A",
          adjective: "big",
          noun: "boy"
        }
      },
      {
        id: 2,
        gender: "Feminine",
        example: {
          article: "A",
          adjective: "tall",
          noun: "girl"
        }
      },
      {
        id: 3,
        gender: "Neutral",
        example: {
          article: "A",
          adjective: "big",
          noun: "sun"
        }
      },
      {
        id: 4,
        gender: "Plural",
        example: {
          article: "",
          adjective: "Tall",
          noun: "kids"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "Nominativo" },
        { id: 2, value: "Acusativo" },
        { id: 3, value: "Dativo" },
        { id: 4, value: "Genitivo" },
        { id: 5, value: "Locativo" },
        { id: 6, value: "Strumental" }],
      columns: [
        { id: 1, value: "Che" },
        { id: 2, value: "Chi" },
        { id: 3, value: "Aggettivo" },
        { id: 4, value: "Sostantivo" }]
    }
  };

  private _german: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculine",
        example: {
          article: "A",
          adjective: "big",
          noun: "boy"
        }
      },
      {
        id: 2,
        gender: "Feminine",
        example: {
          article: "A",
          adjective: "tall",
          noun: "girl"
        }
      },
      {
        id: 3,
        gender: "Neutral",
        example: {
          article: "A",
          adjective: "big",
          noun: "sun"
        }
      },
      {
        id: 4,
        gender: "Plural",
        example: {
          article: "",
          adjective: "Tall",
          noun: "kids"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "Nominativ" },
        { id: 2, value: "Akkusativ" },
        { id: 3, value: "Dativ" },
        { id: 4, value: "Genitiv" },
        { id: 5, value: "Lokativ" },
        { id: 6, value: "Instrumental" }],
      columns: [
        { id: 1, value: "Was" },
        { id: 2, value: "Wer" },
        { id: 3, value: "Adjektiv" },
        { id: 4, value: "Nomen" }]
    }
  };

  private _japanese: Text = {
    contents: [
      {
        id: 1,
        gender: "Masculine",
        example: {
          article: "A",
          adjective: "big",
          noun: "boy"
        }
      },
      {
        id: 2,
        gender: "Feminine",
        example: {
          article: "A",
          adjective: "tall",
          noun: "girl"
        }
      },
      {
        id: 3,
        gender: "Neutral",
        example: {
          article: "A",
          adjective: "big",
          noun: "sun"
        }
      },
      {
        id: 4,
        gender: "Plural",
        example: {
          article: "",
          adjective: "Tall",
          noun: "kids"
        }
      }
    ],
    table: {
      rows: [
        { id: 1, value: "主格" },
        { id: 2, value: "対格" },
        { id: 3, value: "与格" },
        { id: 4, value: "属格" },
        { id: 5, value: "処格" },
        { id: 6, value: "器楽" }],
      columns: [
        { id: 1, value: "何" },
        { id: 2, value: "誰" },
        { id: 3, value: "形容詞" },
        { id: 4, value: "名詞" }]
    }
  };

  private _russianContent: RussianContent = {
    data: [
      {
        id: 1,
        gender: "Мумжской род",
        tableContent: [
          {
            id_row: 1,
            id_column: 3,
            value: "большой"
          },
          {
            id_row: 2,
            id_column: 3,
            value: "большого"
          },
          {
            id_row: 3,
            id_column: 3,
            value: "большому"
          },
          {
            id_row: 4,
            id_column: 3,
            value: "большого"
          },
          {
            id_row: 5,
            id_column: 3,
            value: "большом"
          },
          {
            id_row: 6,
            id_column: 3,
            value: "большим"
          },
          {
            id_row: 1,
            id_column: 4,
            value: "мальчик"
          },
          {
            id_row: 2,
            id_column: 4,
            value: "мальчика"
          },
          {
            id_row: 3,
            id_column: 4,
            value: "мальчику"
          },
          {
            id_row: 4,
            id_column: 4,
            value: "мальчика"
          },
          {
            id_row: 5,
            id_column: 4,
            value: "мльчике"
          },
          {
            id_row: 6,
            id_column: 4,
            value: "мальчиком"
          }
        ]
      },
      {
        id: 2,
        gender: "Женский род",
        tableContent: [
          {
            id_row: 1,
            id_column: 3,
            value: "высокая"
          },
          {
            id_row: 2,
            id_column: 3,
            value: "высокую"
          },
          {
            id_row: 3,
            id_column: 3,
            value: "высокой"
          },
          {
            id_row: 4,
            id_column: 3,
            value: "высокой"
          },
          {
            id_row: 5,
            id_column: 3,
            value: "высокой"
          },
          {
            id_row: 6,
            id_column: 3,
            value: "высокой"
          },
          {
            id_row: 1,
            id_column: 4,
            value: "девочка"
          },
          {
            id_row: 2,
            id_column: 4,
            value: "девочку"
          },
          {
            id_row: 3,
            id_column: 4,
            value: "девочке"
          },
          {
            id_row: 4,
            id_column: 4,
            value: "девочки"
          },
          {
            id_row: 5,
            id_column: 4,
            value: "девочке"
          },
          {
            id_row: 6,
            id_column: 4,
            value: "девочкой"
          }
        ]
      },
      {
        id: 3,
        gender: "Средний род",
        tableContent: [
          {
            id_row: 1,
            id_column: 3,
            value: "высокое"
          },
          {
            id_row: 2,
            id_column: 3,
            value: "высокое"
          },
          {
            id_row: 3,
            id_column: 3,
            value: "высокому"
          },
          {
            id_row: 4,
            id_column: 3,
            value: "высокого"
          },
          {
            id_row: 5,
            id_column: 3,
            value: "высоком"
          },
          {
            id_row: 6,
            id_column: 3,
            value: "высоким"
          },
          {
            id_row: 1,
            id_column: 4,
            value: "солнце"
          },
          {
            id_row: 2,
            id_column: 4,
            value: "солнце"
          },
          {
            id_row: 3,
            id_column: 4,
            value: "солнцу"
          },
          {
            id_row: 4,
            id_column: 4,
            value: "солнца"
          },
          {
            id_row: 5,
            id_column: 4,
            value: "солнце"
          },
          {
            id_row: 6,
            id_column: 4,
            value: "солнцем"
          }
        ]
      },
      {
        id: 4,
        gender: "Множественное число",
        tableContent: [
          {
            id_row: 1,
            id_column: 3,
            value: "высокие"
          },
          {
            id_row: 2,
            id_column: 3,
            value: "высоких"
          },
          {
            id_row: 3,
            id_column: 3,
            value: "высоким"
          },
          {
            id_row: 4,
            id_column: 3,
            value: "высоких"
          },
          {
            id_row: 5,
            id_column: 3,
            value: "высоких"
          },
          {
            id_row: 6,
            id_column: 3,
            value: "высокими"
          },
          {
            id_row: 1,
            id_column: 4,
            value: "дети"
          },
          {
            id_row: 2,
            id_column: 4,
            value: "детей"
          },
          {
            id_row: 3,
            id_column: 4,
            value: "детям"
          },
          {
            id_row: 4,
            id_column: 4,
            value: "детей"
          },
          {
            id_row: 5,
            id_column: 4,
            value: "детях"
          },
          {
            id_row: 6,
            id_column: 4,
            value: "детьми"
          }
        ]
      }
    ],
    general: {
      tableContent: [
        {
          id_row: 1,
          id_column: 1,
          value: "что"
        },
        {
          id_row: 2,
          id_column: 1,
          value: "что"
        },
        {
          id_row: 3,
          id_column: 1,
          value: "чему"
        },
        {
          id_row: 4,
          id_column: 1,
          value: "чего"
        },
        {
          id_row: 5,
          id_column: 1,
          value: "о чём"
        },
        {
          id_row: 6,
          id_column: 1,
          value: "с чем"
        },
        {
          id_row: 1,
          id_column: 2,
          value: "кто"
        },
        {
          id_row: 2,
          id_column: 2,
          value: "кого"
        },
        {
          id_row: 3,
          id_column: 2,
          value: "кому"
        },
        {
          id_row: 4,
          id_column: 2,
          value: "кого"
        },
        {
          id_row: 5,
          id_column: 2,
          value: "о ком"
        },
        {
          id_row: 6,
          id_column: 2,
          value: "с кем"
        }
      ]
    }
  };

  get french(): Text {
    return this._french;
  }

  get english(): Text {
    return this._english;
  }

  get spanish(): Text {
    return this._spanish;
  }

  get italian(): Text {
    return this._italian;
  }

  get german(): Text {
    return this._german;
  }

  get japanese(): Text {
    return this._japanese;
  }
  
  get russianContent(): RussianContent {
    return this._russianContent;
  }

}
export interface Text {
  contents: Array<Content>;
  table: Table;
}
export interface Content {
  id: number;
  gender: string;
  example: Example
}
export interface Table {
  rows: Array<Item>;
  columns: Array<Item>;
}
export interface Example {
  article: string;
  adjective: string;
  noun: string;
}
export interface Item {
  id: number;
  value: string;
}
export interface TableContent {
  gender: string;
  tableContent: Array<Russian>;
}
export interface Data {
  id: number;
  gender: string;
  tableContent: Array<Russian>;
}
export interface RussianContent {
  data: Array<Data>;
  general: { tableContent: Array<Russian>; };
}
export interface Russian {
  id_row: number;
  id_column: number;
  value: string;
}