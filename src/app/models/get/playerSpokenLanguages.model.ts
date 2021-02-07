export class PlayerSpokenLanguage {
    constructor(
        public id: number,
        public playerId: number,
        public certification: string,
        public language: string,
        public level: string
    ) { }
}