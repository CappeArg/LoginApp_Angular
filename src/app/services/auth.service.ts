import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { usuarioModel } from '../models/usuarios.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private url='https://identitytoolkit.googleapis.com/v1/accounts:';
  private apikey='AIzaSyA53Y8WWnR6ZOqphihgb48voEJ16dxqUYU';
  userToken:string;


  //crear nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

//ingresar usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor( private http: HttpClient) { 

    this.leerToken();
  }

  logout(){

    localStorage.removeItem('token');  

  }
  login(usuario:usuarioModel){
    const authData={
      ...usuario,
       returnSecureToken: true
     };
     return this.http.post(
      `${this.url}signInWithPassword?key=${this.apikey}`,
      authData
    ).pipe(map(respuesta => {
      this.guardarToken(respuesta['idToken']);
      return respuesta;
    }));


  }
  nuevoUsuario(usuario:usuarioModel){
     const authData={
      ...usuario,
       returnSecureToken: true
     };
     return this.http.post(
       `${this.url}signUp?key=${this.apikey}`,
       authData
     ).pipe(map(respuesta => {
      this.guardarToken(respuesta['idToken']);
      return respuesta;
    }));
  }

  private  guardarToken( idToken:string ) {

    this.userToken=idToken;
    localStorage.setItem('token',idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira',hoy.getTime().toString());
  }

  leerToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken='';
    }
  }

  estaAutenticado():boolean{

    if( this.userToken.length<2 ) {

      return false;
    }

    const expira = Number( localStorage.getItem('expira'));

    const expiradate = new Date;

    expiradate.setTime(expira);

    if (expiradate> new Date()){

      return true;
    }else{
      return false;
    }

  }

}
