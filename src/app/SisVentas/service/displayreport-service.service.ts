import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DisplayreportServiceService {
  allReportCategories: any[];
  reportByCategoryId: any[];
  allReportsubCategory: any[];
  constructor() {
    this.allReportCategories=[
      {
          'reportCategoryID': 1,
          "reportCategory": "Dashboard Parametric",
          "isDeleted": false,
          "menuIcon": "icon-home"
      },
      {
          "reportCategoryID": 2,
          "reportCategory": "Monitor Reports",
          "isDeleted": false,
          "menuIcon": "icon-list"
      },
      {
          "reportCategoryID": 3,
          "reportCategory": "Other Reports",
          "isDeleted": false,
          "menuIcon": "icon-docs"
      },
      {
          "reportCategoryID": 4,
          "reportCategory": "PCN Flow",
          "isDeleted": false,
          "menuIcon": "icon-list"
      },
      {
          "reportCategoryID": 5,
          "reportCategory": "Compliance By Document",
          "isDeleted": false,
          "menuIcon": "icon-home"
      }
  ];
  this. reportByCategoryId=[
      {
          "reportID": 1,
          "reportName": "xxx",
          "procedureName": null,
          "iconClass": null,
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 3,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 1018,
          "reportName": "SW Test",
          "procedureName": "SP_GetMigrationRuningDataPoint",
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 3,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2018,
          "reportName": "Importer Dashboard Last 10 Hour",
          "procedureName": "dbo.SP_GetLatestImporterDone",
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 2,
          "reportCategoryID": 3,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      }
  ];
  this.allReportsubCategory =[
      {
          "reportID": 1,
          "reportName": "xxx",
          "procedureName": null,
          "iconClass": null,
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 3,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 17,
          "reportName": "Jobs Monitor",
          "procedureName": "sp_job_Report",
          "iconClass": "icon-diamond",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 2,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2025,
          "reportName": "Old Tables Report",
          "procedureName": null,
          "iconClass": "icon-docs",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 5,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ", 1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 1,
          "reportName": "Main Compliance",
          "procedureName": null,
          "iconClass": "icon-rocket",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " ,  TEXT1 , [text5]  ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2022,
          "reportName": "PCN Statistic",
          "procedureName": null,
          "iconClass": "icon-rocket",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 4,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": "sp_PCNNotMatchStatus",
          "parameterName": "RevisionID"
      },
      {
          "reportID": 1018,
          "reportName": "SW Test",
          "procedureName": "SP_GetMigrationRuningDataPoint",
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 1,
          "reportCategoryID": 3,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2018,
          "reportName": "Importer Dashboard Last 10 Hour",
          "procedureName": "dbo.SP_GetLatestImporterDone",
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 2,
          "reportCategoryID": 3,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 16,
          "reportName": "Part Score Conflict With  Summary ",
          "procedureName": null,
          "iconClass": "icon-rocket",
          "isDeleted": false,
          "reportIndex": 2,
          "reportCategoryID": 2,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2023,
          "reportName": "PCN Dunlicate (Year)",
          "procedureName": null,
          "iconClass": "icon-wallet",
          "isDeleted": false,
          "reportIndex": 2,
          "reportCategoryID": 4,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2026,
          "reportName": "Compliance by Document Dashboard",
          "procedureName": null,
          "iconClass": "icon-docs",
          "isDeleted": false,
          "reportIndex": 2,
          "reportCategoryID": 5,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ", 1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 3,
          "reportName": "SUPP-REG",
          "procedureName": null,
          "iconClass": "icon-puzzle",
          "isDeleted": false,
          "reportIndex": 3,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " ,  TEXT2 , [text1]  ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2024,
          "reportName": "PCN Duplicate (Suppliers)",
          "procedureName": null,
          "iconClass": "icon-briefcase",
          "isDeleted": false,
          "reportIndex": 3,
          "reportCategoryID": 4,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2028,
          "reportName": "PCN Teams",
          "procedureName": null,
          "iconClass": "icon-wallet",
          "isDeleted": false,
          "reportIndex": 4,
          "reportCategoryID": 4,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": "Z2DataCore.dbo.getRevision",
          "parameterName": "RevisionID"
      },
      {
          "reportID": 2029,
          "reportName": "Used Tables",
          "procedureName": "sp_GetUsedTableStatisics",
          "iconClass": "icon-wallet",
          "isDeleted": false,
          "reportIndex": 4,
          "reportCategoryID": 2,
          "inRunTime": true,
          "isDownloaded": false,
          "sortingColumns": ",1",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 4,
          "reportName": "SOURCE TYPE",
          "procedureName": null,
          "iconClass": "icon-settings",
          "isDeleted": false,
          "reportIndex": 4,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 5,
          "reportName": "SUPP - SOURCE",
          "procedureName": null,
          "iconClass": "icon-briefcase",
          "isDeleted": false,
          "reportIndex": 5,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 6,
          "reportName": "Supplier Profile",
          "procedureName": null,
          "iconClass": "icon-wallet",
          "isDeleted": false,
          "reportIndex": 6,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 18,
          "reportName": "COC - MCD",
          "procedureName": null,
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 7,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 8,
          "reportName": "Date - SUPP - REG",
          "procedureName": null,
          "iconClass": "icon-docs",
          "isDeleted": false,
          "reportIndex": 8,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 9,
          "reportName": "Conflict Reports",
          "procedureName": null,
          "iconClass": "icon-present",
          "isDeleted": false,
          "reportIndex": 9,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": true,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 10,
          "reportName": "Completeness Report",
          "procedureName": null,
          "iconClass": "icon-folder",
          "isDeleted": false,
          "reportIndex": 10,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 11,
          "reportName": "Compliance Version",
          "procedureName": null,
          "iconClass": "icon-diamond",
          "isDeleted": false,
          "reportIndex": 11,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2019,
          "reportName": "SUPP-SOURCE-TYPE1UF",
          "procedureName": null,
          "iconClass": "icon-equalizer",
          "isDeleted": false,
          "reportIndex": 12,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2020,
          "reportName": "Code Generation Statistics",
          "procedureName": null,
          "iconClass": "icon-rocket",
          "isDeleted": false,
          "reportIndex": 13,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      },
      {
          "reportID": 2021,
          "reportName": "Family OBS Conflict",
          "procedureName": null,
          "iconClass": "icon-diamond",
          "isDeleted": false,
          "reportIndex": 14,
          "reportCategoryID": 1,
          "inRunTime": false,
          "isDownloaded": false,
          "sortingColumns": " , 1 ",
          "downLoadProcedureName": null,
          "parameterName": null
      }
  ];
  //   this.allReportCategories = [
  //     {
  //         "id_privilegio": 8,
  //         "pri_nombre": "Compra",
  //         "pri_icon": "fas fa-shopping-basket"
  //     },
  //     {
  //         "id_privilegio": 22,
  //         "pri_nombre": "ALmacen",
  //         "pri_icon": "fas fa-box-open"
  //     },
  //     {
  //         "id_privilegio": 23,
  //         "pri_nombre": "Admin",
  //         "pri_icon": "fas fa-user-cog"
  //     }
  //   ];
  //   this. reportByCategoryId = [
  //     {
  //         "sub_pri_nombre": "index",
  //         "menuIcon": "icon-equalizer",
  //         "id_privilegio": 8,
  //     },
  //     {
  //         "sub_pri_nombre": "Producto",
  //         "iconClass": "icon-equalizer",
  //         "id_privilegio": 22,
  //     },
  //     {
  //       "sub_pri_nombre": "Usuarios",
  //       "iconClass": null,
  //       "id_privilegio": 23,
  //   },
  //   ];
  }
  getallReportCategories(): any[] {
    return this.allReportCategories;
  }
  GetreportByCategoryId(id: string) {
    return this.allReportsubCategory
      .filter(reportsubCategory => reportsubCategory.reportCategoryID == id);
  }
  getallReportsubCategory():any[]{
    //return this.http.get<any>('http://localhost:61265/api/report/GetAllSubCategories')
    //.map(res=>res);
    return this.allReportsubCategory;
  }
}
