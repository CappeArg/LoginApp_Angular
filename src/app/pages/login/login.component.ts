import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { usuarioModel } from '../../models/usuarios.models';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
 

  usuario: usuarioModel = new usuarioModel();
  recordarme:boolean;


  constructor( private auth:AuthService,
               private router:Router ) {
                 
                          this.recordarme= false;
                }

  ngOnInit() {
    if ( localStorage.getItem('email') ) {
      this.usuario.email = localStorage.getItem('email');
    } else {
      localStorage.removeItem('email');
   }

    };

  login(form:NgForm){

    if (form.invalid){
      return;
    }else{
      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...',
      });
      Swal.showLoading();
      
      this.auth.login(this.usuario)
      .subscribe( respuesta => {

        console.log(respuesta);
        Swal.close();
        
        if (this.recordarme) {
          localStorage.setItem('email', this.usuario.email);
        } else {
           localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/home');
      }, err=> {

        console.log(err.error.error.message)
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message
        });
      });
    }
  }

}
