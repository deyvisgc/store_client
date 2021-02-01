import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnviromentService {
  public urlAddress: string = environment.urlAddress;
  constructor() { }
}
