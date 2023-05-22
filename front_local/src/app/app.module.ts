import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { APlogoComponent } from './componentes/aplogo/aplogo.component';
import { BannerComponent } from './componentes/banner/banner.component';
import { AcercaDeComponent } from './componentes/acerca-de/acerca-de.component';
import { EducacionComponent } from './componentes/educacion/educacion.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { HardSoftSkillsComponent } from './componentes/hard-soft-skills/hard-soft-skills.component';
import { ProyectoComponent } from './componentes/proyecto/proyecto.component';
import { FooterComponent } from './componentes/footer/footer.component';
import {HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './componentes/home/home.component';
import { LoginComponent } from './componentes/login/login.component'
import { FormsModule } from '@angular/forms';
import { interceptorProvider } from './servicio/interceptor-service';
import { ExperienciaLaboralComponent } from './componentes/experiencia-laboral/experiencia-laboral.component';
import { NewExperienciaComponent } from './componentes/experiencia-laboral/new-experiencia.component';
import { EditExperienciaComponent } from './componentes/experiencia-laboral/edit-experiencia.component';
import { NeweducacionComponent } from './componentes/educacion/neweducacion.component';
import { EditeducacionComponent } from './componentes/educacion/editeducacion.component';
import { NewproyectoComponent } from './componentes/proyecto/newproyecto.component';
import { EditproyectoComponent } from './componentes/proyecto/editproyecto.component';
import { InfopComponent } from './componentes/acerca-de/infop.component';
import { NewhabilidadComponent } from './componentes/hard-soft-skills/newhabilidad.component';
import { EdithabilidadComponent } from './componentes/hard-soft-skills/edithabilidad.component';
import { EditbannerComponent } from './componentes/banner/editbanner.component';
import { NewredComponent } from './componentes/aplogo/newred.component';
import { EditredComponent } from './componentes/aplogo/editred.component';







@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    APlogoComponent,
    BannerComponent,
    AcercaDeComponent,
    EducacionComponent,
    HardSoftSkillsComponent,
    ProyectoComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    ExperienciaLaboralComponent,
    NewExperienciaComponent,
    EditExperienciaComponent,
    NeweducacionComponent,
    EditeducacionComponent,
    NewproyectoComponent,
    EditproyectoComponent,
    InfopComponent,
    NewhabilidadComponent,
    EdithabilidadComponent,
    EditbannerComponent,
    NewredComponent,
    EditredComponent,
    
    
  
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgCircleProgressModule.forRoot({}),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    interceptorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
