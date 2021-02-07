import { PlayerSpokenLanguage } from "./playerSpokenLanguages.model";

export class Player {
  constructor(
    public birthCountryRefId: number,
    public birthDate: string,
    public email: string,
    public firstName: string,
    public genderRefId: number,
    public imageRefId: number,
    public lastName: string,
    public login: string,
    public password: string,
    public phone: string,
    public playerSpokenLanguages?: Array<PlayerSpokenLanguage>
  ) { }
}
