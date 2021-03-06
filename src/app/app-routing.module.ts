import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckloginGuard } from './SisVentas/guards/checklogin.guard';

const routes: Routes = [
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'email',
        loadChildren: () => import('./email/email.module').then(m => m.EmailModule)
    },
    {
        path: 'apps',
        loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule)
    },
    {
        path: 'widget',
        loadChildren: () => import('./widget/widget.module').then(m => m.WidgetModule)
    },
    {
        path: 'ui',
        loadChildren: () => import('./ui/ui.module').then(m => m.UiModule)
    },
    {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.FormModule)
    },
    {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
    },
    {
        path: 'media',
        loadChildren: () => import('./media/media.module').then(m => m.MediaModule)
    },
    {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
    },
    {
        path: 'timeline',
        loadChildren: () => import('./timeline/timeline.module').then(m => m.TimelineModule)
    },
    {
        path: 'icons',
        loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule)
    },
    {
        path: 'auth',
        loadChildren: () => import('./SisVentas/Auth/login.module').then(m => m.LoginModule)
    },
    {
        path: 'extra-pages',
        loadChildren: () => import('./extra-pages/extra-pages.module').then(m => m.ExtraPagesModule)
    },
    {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
    },
    {
        path: 'Administracion',
        loadChildren: () => import('./SisVentas/administracion/administracion.module').then(m => m.AdministracionModule),
        canActivate: [CheckloginGuard],
        data: {role: ['vendedor', 'Administrador']}
    },
    {
        path: 'Almacen',
        loadChildren: () => import('./SisVentas/almacen/almacen.module').then(m => m.AlmacenModule),
        canActivate: [CheckloginGuard],
        data: {role: ['vendedor', 'Administrador']},
    },
    {
        path: 'Caja',
        loadChildren: () => import('./SisVentas/caja/caja.module').then(m => m.CajaModule),
        canActivate: [CheckloginGuard]
    },
    {
        path: 'Compras',
        loadChildren: () => import('./SisVentas/compras/compras.module').then(m => m.ComprasModule),
        canActivate: [CheckloginGuard],
        data: {role: ['vendedor', 'Administrador']}
    },
    {
        path: 'Sangria',
        loadChildren: () => import('./SisVentas/sangria/sangria.module').then(m => m.SangriaModule),
        canActivate: [CheckloginGuard],
        data: {role: ['vendedor', 'Administrador']}
    },
    {
        path: 'Reportes',
        loadChildren: () => import('./SisVentas/reportes/reportes.module').then(m => m.ReportesModule),
        canActivate: [CheckloginGuard],
        data: {role: ['vendedor', 'Administrador']}
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
