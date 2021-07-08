import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from './environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    basePath = `${environment.basePath}`

    constructor(private _http: HttpClient) { }

    getUsers(): Observable<any> {
        return this._http.get(`api/users`)
    }

    deleteUser(id: String): Observable<any> {
        return this._http.delete(`api/users/delete/` + id)
    }

    addUser(data: any): Observable<any> {
        return this._http.post(`api/users/add`, data)
    }
    updateUser(userid: String, data: any): Observable<any> {
        return this._http.put(`api/users/edit/` + userid, data)
    }
    getUserInfo(id: String): Observable<any> {
        return this._http.get(`api/users/` + id)
    }
}
