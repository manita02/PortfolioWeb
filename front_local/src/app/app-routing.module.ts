import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InfopComponent } from './componentes/acerca-de/infop.component';
import { EditredComponent } from './componentes/aplogo/editred.component';
import { NewredComponent } from './componentes/aplogo/newred.component';
import { EditbannerComponent } from './componentes/banner/editbanner.component';
import { EditeducacionComponent } from './componentes/educacion/editeducacion.component';
import { NeweducacionComponent } from './componentes/educacion/neweducacion.component';
import { EditExperienciaComponent } from './componentes/experiencia-laboral/edit-experiencia.component';
import { NewExperienciaComponent } from './componentes/experiencia-laboral/new-experiencia.component';
import { EdithabilidadComponent } from './componentes/hard-soft-skills/edithabilidad.component';
import { NewhabilidadComponent } from './componentes/hard-soft-skills/newhabilidad.component';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { EditproyectoComponent } from './componentes/proyecto/editproyecto.component';
import { NewproyectoComponent } from './componentes/proyecto/newproyecto.component';

const routes: Routes = [
  {path:'',component: HomeComponent},
  {path:'login',component: LoginComponent},
  {path: 'nuevaexp', component: NewExperienciaComponent},
  {path: 'editexp/:id', component: EditExperienciaComponent},
  {path: 'nuevaedu', component: NeweducacionComponent},
  {path: 'editedu/:id', component: EditeducacionComponent},
  {path: 'nuevoproyecto', component: NewproyectoComponent},
  {path: 'editproyect/:id', component: EditproyectoComponent},
  {path: 'editinfop/:id', component: InfopComponent},
  {path: 'nuevahabilidad', component: NewhabilidadComponent},
  {path: 'edithabilidad/:id', component: EdithabilidadComponent},
  {path: 'editbanner/:id', component: EditbannerComponent},
  {path: 'nuevaredsocial', component: NewredComponent},
  {path: 'editred/:id', component: EditredComponent}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
