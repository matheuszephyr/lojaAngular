import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { CestaComponent } from './cesta/cesta.component';
import { FinalComponent } from './final/final.component';

const routes: Routes = [
  { path: 'login/:idpedido/:idusuario', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cesta/:idpedido', component: CestaComponent },
  { path: 'final/:idpedido/:idusuario', component: FinalComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
