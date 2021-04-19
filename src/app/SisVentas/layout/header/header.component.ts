import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../service/Authentication/authentication.service';
import iziToast from 'izitoast';
declare const sendRespuesta: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  constructor(private autservice: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }
  Logout() {
    const vm = this;
    vm.autservice.Logout().then( res => {
      const rpta = sendRespuesta(res);
      if (rpta.status) {
        // this.toastr.success('Exito!', 'Inicio sesion Cerrada');
        iziToast.success({
          title: 'Exito',
          position: 'topRight',
          message: rpta.message,
        });
        this.router.navigate(['/']);
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
      } else {
        // this.toastr.error('Error', 'al serrar sesion');
        iziToast.error({
          title: 'Error',
          position: 'topRight',
          message: rpta.message,
        });
        return false;
      }
    }).then(() => {

    }).finally(() => {

    });
  }
}
