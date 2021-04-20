import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/Authentication/authentication.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuario: '';
  password: '';
  keycript = 'K56QSxGeKImwBRmiY';
  btnisLoading = false;
  constructor(private formBuilder: FormBuilder, private autservice: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }
  Login() {
    const vm = this;
    if (!vm.usuario) {
      iziToast.warning({
        title: 'Upss',
        position: 'topRight',
        message: 'usuario requerido',
      });
      return false;
    }
    if (!vm.password) {
      iziToast.warning({
        title: 'Upss',
        position: 'topRight',
        message: 'password requerido',
      });
      return false;
    }
    vm.btnisLoading = true;
    const password = this.autservice.CryptoJSAesEncrypt(this.keycript, vm.password);
    vm.autservice.loginUser(this.usuario, password).then( res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        // vm.router.navigate(['dashboard']);
        localStorage.setItem('token', rpta.api_key);
        localStorage.setItem('usuario', rpta.perfil.us_usuario);
        localStorage.setItem('idUsuario', rpta.perfil.id_user);
        localStorage.setItem('caja', rpta.caja.id_caja);
        localStorage.setItem('rol_name', rpta.rolName);
        localStorage.setItem('idRol', rpta.perfil.id_rol);
        iziToast.success({
          title: 'Exito',
          position: 'topRight',
          message: 'Exito al iniciar session',
        });
        window.location.replace('#/Compras/Index');
        return false;
      } else {
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
        return false;
      }
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      console.log('entro');
      vm.btnisLoading = false;
    });
  }
  verContra() {
    alert('deyvis');
  }
}
