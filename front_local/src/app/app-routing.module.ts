import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditredComponent } from './componentes/aplogo/editred.component';
import { NewredComponent } from './componentes/aplogo/newred.component';
import { EditeducacionComponent } from './componentes/educacion/editeducacion.component';
import { NeweducacionComponent } from './componentes/educacion/neweducacion.component';
import { EdithabilidadComponent } from './componentes/hard-soft-skills/edithabilidad.component';
import { NewhabilidadComponent } from './componentes/hard-soft-skills/newhabilidad.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginRedirectGuard } from './servicio/login-redirect.guard';
import {
  ExperienciaCreateGuard,
  ExperienciaEditGuard,
} from './servicio/experiencia-modal.guard';
import { BannerEditGuard } from './servicio/banner-modal.guard';
import { PersonaEditGuard } from './servicio/persona-modal.guard';
import { EditproyectoComponent } from './componentes/proyecto/editproyecto.component';
import { NewproyectoComponent } from './componentes/proyecto/newproyecto.component';
import { ComponentesDemoComponent } from './compartido/componentes-demo/componentes-demo.component';

const routes: Routes = [
  {path:'',component: HomeComponent},
  { path: 'login', canActivate: [LoginRedirectGuard], component: HomeComponent },
  { path: 'nuevaexp', canActivate: [ExperienciaCreateGuard], component: HomeComponent },
  { path: 'editexp/:id', canActivate: [ExperienciaEditGuard], component: HomeComponent },
  {path: 'nuevaedu', component: NeweducacionComponent},
  {path: 'editedu/:id', component: EditeducacionComponent},
  {path: 'nuevoproyecto', component: NewproyectoComponent},
  {path: 'editproyect/:id', component: EditproyectoComponent},
  { path: 'editinfop/:id', canActivate: [PersonaEditGuard], component: HomeComponent },
  {path: 'nuevahabilidad', component: NewhabilidadComponent},
  {path: 'edithabilidad/:id', component: EdithabilidadComponent},
  { path: 'editbanner/:id', canActivate: [BannerEditGuard], component: HomeComponent },
  {path: 'nuevaredsocial', component: NewredComponent},
  {path: 'editred/:id', component: EditredComponent},
  {path: 'dev/componentes', component: ComponentesDemoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
