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
        localStorage.setItem('isLoggedIn', 'true');
        this.isLoggedInSubject.next(true);
    }

    public logout() {
        localStorage.removeItem('isLoggedIn');
        this.isLoggedInSubject.next(false);
        this.statusSubject.next('none');
    }
}