import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { HeaderComponent } from './componentes/header/header.component';

import { APlogoComponent } from './componentes/aplogo/aplogo.component';

import { BannerComponent } from './componentes/banner/banner.component';

import { AcercaDeComponent } from './componentes/acerca-de/acerca-de.component';

import { EducacionComponent } from './componentes/educacion/educacion.component';

import { HardSoftSkillsComponent } from './componentes/hard-soft-skills/hard-soft-skills.component';

import { ProyectoComponent } from './componentes/proyecto/proyecto.component';

import { FooterComponent } from './componentes/footer/footer.component';

import {HttpClientModule } from '@angular/common/http';

import { HomeComponent } from './componentes/home/home.component';

import { LoginComponent } from './componentes/login/login.component'

import { FormsModule } from '@angular/forms';

import { interceptorProvider } from './servicio/interceptor-service';

import { ExperienciaLaboralComponent } from './componentes/experiencia-laboral/experiencia-laboral.component';

import { ExperienciaFormModalComponent } from './componentes/experiencia-laboral/experiencia-form-modal.component';

import { EducacionFormModalComponent } from './componentes/educacion/educacion-form-modal.component';

import { ProyectoFormModalComponent } from './componentes/proyecto/proyecto-form-modal.component';

import { PersonaFormModalComponent } from './componentes/acerca-de/persona-form-modal.component';

import { HabilidadFormModalComponent } from './componentes/hard-soft-skills/habilidad-form-modal.component';

import { BannerFormModalComponent } from './componentes/banner/banner-form-modal.component';

import { RedsocialFormModalComponent } from './componentes/aplogo/redsocial-form-modal.component';

import { OrganizacionFormModalComponent } from './componentes/organizacion/organizacion-form-modal.component';

import { SharedModule } from './compartido/shared.module';

import { ComponentesDemoComponent } from './compartido/componentes-demo/componentes-demo.component';

import { SplashScreenComponent } from './compartido/splash-screen/splash-screen.component';



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

    ExperienciaFormModalComponent,

    EducacionFormModalComponent,

    ProyectoFormModalComponent,

    PersonaFormModalComponent,

    HabilidadFormModalComponent,

    BannerFormModalComponent,

    RedsocialFormModalComponent,

    OrganizacionFormModalComponent,

    ComponentesDemoComponent,

    SplashScreenComponent,

  ],

  imports: [

    BrowserModule,

    AppRoutingModule,

    HttpClientModule,

    FormsModule,

    SharedModule

  ],

  providers: [

    interceptorProvider

  ],

  bootstrap: [AppComponent]

})

export class AppModule { }

