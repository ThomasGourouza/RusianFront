import { PlayerSpokenLanguage } from "./playerSpokenLanguages.model";

export class Player {
  constructor(
    public id: number,
    public birthCountry: string,
    public birthDate: string,
    public email: string,
    public firstName: string,
    public gender: string,
    public imageUrl: string,
    public lastName: string,
    public login: string,
    public phone: string,
    public playerSpokenLanguages?: Array<PlayerSpokenLanguage>
  ) { }
}
