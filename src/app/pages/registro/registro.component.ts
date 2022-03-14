import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


import { usuarioModel } from '../../models/usuarios.models';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario:usuarioModel
  recordarme:boolean;

  constructor( private auth:AuthService, private router:Router ) { 
    this.recordarme=false;
  }

  ngOnInit( ) {
    
    this.usuario=new usuarioModel();
   }

   onSubmit(f:NgForm){

    if(f.valid){

      Swal.fire({
        allowOutsideClick: false,
        icon: 'info',
        text: 'Espere por favor...',
      });
      Swal.showLoading();

      this.auth.nuevoUsuario(this.usuario)
      .subscribe(respuesta=>{
       
        Swal.close();
        if (this.recordarme) {
          localStorage.setItem('email', this.usuario.email);
        } else {
           localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/home');
        console.log(respuesta)
      
      }, (err)=>  {      
      Swal.fire({
        icon: 'error',
        title: 'Error al Registrar',
        text: err.error.error.message
      });
      console.log(err.error.error.message)
    });
  }
}

}