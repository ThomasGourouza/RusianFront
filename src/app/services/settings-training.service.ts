import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface NounPractice {
    noun: string;
    translation: string;
    declension: number;
}
export interface AdjectivePractice {
    adjective: string;
    translation: string;
    declension: number;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsTrainingService {

    private _nouns$ = new BehaviorSubject<Array<NounPractice>>([]);
    private _adjectives$ = new BehaviorSubject<Array<AdjectivePractice>>([]);

    constructor() { }

    public get nouns$(): Observable<Array<NounPractice>> {
        return this._nouns$.asObservable();
    }

    public get adjectives$(): Observable<Array<AdjectivePractice>> {
        return this._adjectives$.asObservable();
    }

    public setNouns(nouns: Array<NounPractice>): void {
        this._nouns$.next(nouns);
    }

    public setAdjectives(adjectives: Array<AdjectivePractice>): void {
        this._adjectives$.next(adjectives);
    }

}
