import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayreportServiceService {
  allReportCategories: any[];
  reportByCategoryId: any[];
  allReportsubCategory: any[];
  constructor() {
    this.allReportCategories = [
      {
          "id_privilegio": 8,
          "pri_nombre": "Compra",
          "pri_icon": "fas fa-shopping-basket"
      },
      {
          "id_privilegio": 22,
          "pri_nombre": "ALmacen",
          "pri_icon": "fas fa-box-open"
      },
      {
          "id_privilegio": 23,
          "pri_nombre": "Admin",
          "pri_icon": "fas fa-user-cog"
      }
    ];
    this. reportByCategoryId=[
      {
          "sub_pri_nombre": "index",
          "menuIcon": "icon-equalizer",
          "id_privilegio": 8,
      },
      {
          "sub_pri_nombre": "Producto",
          "iconClass": "icon-equalizer",
          "id_privilegio": 22,
      },
      {
        "sub_pri_nombre": "Usuarios",
        "iconClass": null,
        "id_privilegio": 23,
    },
    ];
  }
  getallReportCategories():any[] {
    return this.allReportCategories;
  }
  GetreportByCategoryId(id: string) {
    return this.reportByCategoryId.filter(reportsubCategory => reportsubCategory.id_privilegio === id);
  }
}
