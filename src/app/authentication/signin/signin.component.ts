import { Component, OnInit } from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import {AuthenticationService} from '../../SisVentas/service/Authentication/authentication.service';
declare const jQuery: any;

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    private TO_DECRYPT_ENCRYPT = 'K56QSxGeKImwBRmiYoP';

    constructor(
        private Toastr: ToastrService,
        private Auth: AuthenticationService,
    ) { }

    ngOnInit() {
        (function ($) {
            "use strict";



            /*==================================================================
            [ Focus input ]*/
            $('.input100').each(function () {
                $(this).on('blur', function () {
                    if ($(this).val().trim() != "") {
                        $(this).addClass('has-val');
                    }
                    else {
                        $(this).removeClass('has-val');
                    }
                })
            })


            /*==================================================================
            [ Validate ]*/
            var input = $('.validate-input .input100');

            $('.validate-form').on('submit', function () {
                var check = true;

                for (var i = 0; i < input.length; i++) {
                    if (validate(input[i]) == false) {
                        showValidate(input[i]);
                        check = false;
                    }
                }

                return check;
            });


            $('.validate-form .input100').each(function () {
                $(this).focus(function () {
                    hideValidate(this);
                });
            });

            function validate(input) {
                if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
                    if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                        return false;
                    }
                }
                else {
                    if ($(input).val().trim() == '') {
                        return false;
                    }
                }
            }

            function showValidate(input) {
                var thisAlert = $(input).parent();

                $(thisAlert).addClass('alert-validate');
                $(".erroe_dis").remove();
                $(".alert-validate").append('<i class="material-icons erroe_dis">error</i>');
            }

            function hideValidate(input) {
                var thisAlert = $(input).parent();

                $(thisAlert).removeClass('alert-validate');
                $(".erroe_dis").remove();
            }

            /*==================================================================
            [ Show pass ]*/
            var showPass = 0;
            $('.btn-show-pass').on('click', function () {
                if (showPass == 0) {
                    $(this).next('input').attr('type', 'text');
                    $(this).addClass('active');
                    showPass = 1;
                }
                else {
                    $(this).next('input').attr('type', 'password');
                    $(this).removeClass('active');
                    showPass = 0;
                }

            });


        })(jQuery);
    }

    loginUser(event: any) {
        const form = event.target;
        const userName = form.userName.value;
        const userPassword = form.userPassword.value;

        if (userPassword == '' || userName == '') {
           return this.Toastr.error('CAMPOS INCOMPLETOS', 'Ingrese usuario y contraseña')
        }

        const passwordEncrypt = this.CryptoJSAesEncrypt(this.TO_DECRYPT_ENCRYPT, userPassword);

        this.Auth.loginUser(userName, passwordEncrypt).subscribe(
            resp => {
                if (resp['original']['status'] === true) {
                    localStorage.setItem('TOKEN_USER', resp['original']['token_user']);
                    localStorage.setItem('NAME_ROL', atob(resp['original']['name_rol']));
                    localStorage.setItem('USER_NAME', atob(resp['original']['user_name']));
                    localStorage.setItem('ROL', resp['original']['rol']);
                    localStorage.setItem('IDENTIFIER', resp['original']['identifier']);
                    this.Toastr.info('Iniciaste Sesion con exito', 'SESIÓN INICIADA');
                    window.location.replace('#/dashboard/main');
                } else {
                    return this.Toastr.error('Digite su contraseña correctamente', 'ERROR CONTRASEÑA');
                }
            },
            error => {
                console.log(error);
                return this.Toastr.error('No se pudo contactar con el servidor', 'ERROR INESPERADO');
            }
        );

        event.preventDefault();
    }

    CryptoJSAesEncrypt(passphrase, plaintext) {

        const salt = CryptoJS.lib.WordArray.random(256);
        const iv = CryptoJS.lib.WordArray.random(16);

        const key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });

        const encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv: iv});

        const data = {
            ciphertext : CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
            salt : CryptoJS.enc.Hex.stringify(salt),
            iv : CryptoJS.enc.Hex.stringify(iv)
        };

        return JSON.stringify(data);
    }

    CryptoJSAesDecrypt(passphrase, encryptedJsonString) {

        const objJson = JSON.parse(encryptedJsonString);
        const encrypted = objJson.ciphertext;
        const salt = CryptoJS.enc.Hex.parse(objJson.salt);
        const iv = CryptoJS.enc.Hex.parse(objJson.iv);
        const key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
}
