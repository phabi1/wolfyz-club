import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly statusSubject = new BehaviorSubject<'none' | 'authenticating' | 'authenticated'>('none');
    private readonly isLoggedInSubject = new BehaviorSubject<boolean>(false);

    constructor() { }

    get status$() {
        return this.statusSubject.asObservable();
    }

    get isLoggedIn$() {
        return this.isLoggedInSubject.asObservable();
    }

    public authenticate() {
        this.statusSubject.next('authenticating');

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.isLoggedInSubject.next(isLoggedIn);
        this.statusSubject.next('authenticated');
    }

    public login() {
        this.statusSubject.next('authenticated');
        this.isLoggedInSubject.next(true);
        localStorage.setItem('isLoggedIn', 'true');
    }

    public logout() {
        this.statusSubject.next('none');
        this.isLoggedInSubject.next(false);
        localStorage.setItem('isLoggedIn', 'false');
    }
}