<section align="center">
    <h1 align="center">💼📚PORTFOLIO WEB👩‍💻💻</h1>
    <img src="https://imgfz.com/i/AS7man9.jpeg">
   <section align="center">
        <img src="https://img.shields.io/badge/STATE-FINISHED-green" alt="Estado del Proyecto">
   </section>
</section>


# Índice
- [Sobre Portfolio Web :briefcase::computer::computer_mouse:](#sobre-portfolio-web-briefcasecomputercomputer_mouse)
- [Programas necesarios :memo:](#white_check_mark-programas-necesariosmemo)
- [Descargar proyecto :inbox_tray:](#white_check_mark-descargar-proyectoinbox_tray) 
- [Hacer funcionar el backend :keyboard:](#white_check_mark-hacer-funcionar-el-backendkeyboard)
- [Comprobar si se estableció la conexión a la base de datos correctamente :chart_with_downwards_trend:](#white_check_mark-comprobar-si-se-estableció-la-conexión-a-la-base-de-datos-correctamentechart_with_downwards_trend)
- [Hacer funcionar el frontend :electron:](#white_check_mark-hacer-funcionar-el-frontendelectron)
- [Insertar roles en la base de datos :gear:](#white_check_mark-insertar-roles-en-la-base-de-datosgear)
- [Abrir Postman :orange_circle:](#white_check_mark-abrir-postmanorange_circle)
  - [Crear Usuario :accessibility:](#heavy_check_mark-crear-usuarioaccessibility)
  - [Obtener el Token :beginner:](#heavy_check_mark-obtener-el-tokenbeginner)
  - [Pegar Token en Authorization :fleur_de_lis:](#heavy_check_mark-pegar-token-en-authorizationfleur_de_lis)
  - [Crear persona que corresponde al usuario creado anteriormente :restroom:](#heavy_check_mark-crear-persona-que-corresponde-al-usuario-creado-anteriormenterestroom)
  - [Crear banner :iphone:](#heavy_check_mark-crear-banneriphone)
- [Ejecutar el sitio web por completo :rocket:](#ballot_box_with_check-ejecutar-el-sitio-web-por-completorocket)
- [Sitio Web Online :meridians:](#sitio-web-online-globe_with_meridians)
- [Tecnologías utilizadas :hammer_and_pick:](#tecnologías-utilizadas-hammer_and_pick)
- [Autor :black_nib:](#autor-black_nib)


## Sobre Portfolio Web :briefcase::computer::computer_mouse:
<p align="justify">
  Es una aplicación web full stack, que muestra: datos personales, estudios cursados📚, experiencia laboral, hard & soft skills, proyectos, etc. Contiene un diseño de interface (front end) que muestra la información, una base de datos que almacena los datos💾 antes mencionados y posee las APIs necesarias para proveer a través de internet📡 la información (back end).
</p>

## :white_check_mark: `Programas necesarios`:memo:
- Descargar e Instalar :arrow_down_small: 
  - <a href="https://visualstudio.microsoft.com/es/" target="_blank">Visual Studio Code</a> 
  - <a href="https://www.apachefriends.org/es/index.html" target="_blank"> 
        XAMPP
    </a> 
  - <a href="https://nodejs.org/en" target="_blank">Node.js</a>  
  - <a href="https://www.youtube.com/watch?v=mq0_LX_vmsA" target="_blank">Apache NetBeans IDE</a> 
  - <a href="https://www.postman.com/downloads/" target="_blank">Postman</a> 
- Instalar la última versión de *angular cli* dentro del sistema:
  - Ir al buscador de windows y luego escribir *CMD*
  - <a href="https://www.trucoswindows.com/tutorial/ejecutar-simbolo-del-sistema-cmd-como-administrador" target="_blank">Ejecutar CMD como administrador</a>  
  - Una vez dentro de la consola escribir el comando: 
    ```bash
    npm install -g @angular/cli@latest
    ```

## :white_check_mark: `Descargar proyecto`:inbox_tray:
- [Descargar proyecto](https://github.com/manita02/APLOCAL/archive/refs/heads/main.zip):anger:


## :white_check_mark: `Hacer funcionar el backend`:keyboard: 
- Ejecutar XAMPP
- Iniciar los servidores Apache y MySQL ⚙️
  <section align="center">
       <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/XAMPP_Windows_10.PNG" alt="Servidores activos">
  </section>
- Abrir phpMyAdmin presionando<a href="https://www.youtube.com/watch?v=giCmjKBmK6A" target="_blank"> el boton Admin </a>en el servidor MySQL desde XAMPP :bulb:
- <a href="https://disenowebakus.net/crear-una-base-de-datos-phpmyadmin-mysql-php.php" target="_blank"> Crear la base de datos y ponerle de nombre " backendaj ".</a> ⚠️ IMPORTANTE NO AGREGARLE TABLAS A LA BD, tiene que estar VACÍA ⚠️
- Ejecutar Apache NetBeans IDE
- Abrir la carpeta " back_local ", que se encuentra en repositorio descargado anteriormente, <a href="https://www.youtube.com/watch?v=pqvPri4enR4" target="_blank">con NetBeans</a>
- Si aparece *aj* con un simbolo de advertencia⚠️ hay que resolver problemas :point_right: Click derecho al ícono del proyecto☕ :point_right: Resolve Projects Problems :point_right: luego apretar boton Resolve...

<!-- 
- abria que poner una imagen de esto pero lo tengo q hacer en una pc desde cero en cristi puede ser

- Luego dar todo accept y siguiente y se resuelve solo
-->

- Desplegar las carpetas del proyecto (" aj ") y buscar la que dice *Other Sources*
- Desplegar todo hacia abajo hasta encontrar el archivo *application.properties*: 
  <section align="center">
       <img src="https://imgfz.com/i/EHT3cgK.jpeg" alt="application.properties">
  </section>
- Donde dice "usuario"🧿 hay que poner el nombre de usuario con el que se conectará a la BD. Si tenemos un usuario con diferente nombre al de root, modificarlo y escribir el nombre que corresponda:bangbang: 
- Si tenemos una <a href="https://www.mclibre.org/consultar/webapps/lecciones/phpmyadmin-1-soluciones.html" target="_blank"> contraseña🔐 para nuestro usuario </a> hay que escribirla donde dice "clave del usuario", y luego descomentar esa línea de código. Si es que NO tenemos contraseña🔓 hay que dejar comentada la línea de codigo como viene por defecto.


### :white_check_mark: `Comprobar si se estableció la conexión a la base de datos correctamente`:chart_with_downwards_trend: 
- Abrir xampp y activar los servidores apache y mysql🔌
- Volver al NetBeans con el proyecto abierto y desplegar otra vez las carpetas, buscar la que se llama " com.portfolioweb.aj " dentro tendra un archivo con nombre *AjApplication.java* 👉 Click derecho y " Run File "
  <section align="center">
       <img src="https://imgfz.com/i/gPkZoq9.jpeg" alt="Run Back End">
  </section>
- Si todo salió BIEN✔️ en la ventana " Output - Run (AjApplication) " tiene que decir: 
    ```
    Tomcat started on port(s): 8080 
    Started AjApplication in 12.662 seconds
    ```
- Se tiene que haber activado el servidor Tomcat y decir que la aplicación inició👌
- Tambien se puede comprobar en el panel de XAMPP que el servidor Tomcat este activo✔️ despues de ejecutar el proyecto:
  <section align="center">
       <img src="https://imgfz.com/i/GwnVl1p.jpeg" alt="Funcionando el Back End">
  </section>


## :white_check_mark: `Hacer funcionar el frontend`:electron: 
- Crear una nueva carpeta vacía📁 con un nombre, puede ser "frontend"
- Luego abrir esa carpeta vacía📂 con el Visual Studio Code
- Buscar en el menu de opciones que aparece en la parte superior donde dice " Terminal " --> " New Terminal "
- Luego cambiar a command promt en la parte inferior donde esta el símbolo " + "
- Chequear que la ubicación sea la correcta de la carpeta vacía📁 que se creo anteriormente
  <section align="center">
       <img src="https://imgfz.com/i/VLx2pQM.jpeg" alt="Terminal en VsCode">
  </section>
- Ejecutar el siguiente comando: 
  ```bash
    ng new "portfolioweb"
  ```

- Elegir la opción (utilizando las flechitas) " css " y luego presioner enter
  <section align="center">
       <img src="https://imgfz.com/i/XeH60lg.jpeg" alt="Terminal en VsCode">
  </section> 
- Cuando realiza la pregunta💬 responder con la la letra (y) y luego presionar enter
  <section align="center">
       <img src="https://imgfz.com/i/XvSAgi4.jpeg" alt="Terminal en VsCode">
  </section> 

- Cerrar❌ el Visual Studio Code cuando haya terminado todo el proceso
- Buscar🧐 la carpeta " front_local ", que se encuentra en el repositorio descargado anteriormente 
  <section align="center">
       <img src="https://imgfz.com/i/3A0ftrH.jpeg" alt="Terminal en VsCode">
  </section> 
- Copiar todos los archivos🗃️ y pegarlos (sobreescribiendo los archivos) en esta nueva carpeta donde se abrió la terminal (en este caso la carpeta se llama " frontend ")
  <section align="center">
       <img src="https://imgfz.com/i/S27w4N9.jpeg" alt="Terminal en VsCode">
  </section> 
- Abrir nuevamente la carpeta, donde se copiaron los archivos anteriores, con el Visual Studio Code
- Abrir otra vez la terminal y ejecutar el siguiente comando:
  ```bash
    npm install
  ```
  <section align="center">
       <img src="https://imgfz.com/i/72IMC8d.jpeg" alt="npm_install">
  </section> 
  
- Si lanza la opción de ejecutar " npm audit fix ", ejecutarlo: 
  ```bash
    npm audit fix
  ```
- Luego ejecutar el siguiente comando:
  ```bash
    npm run build
  ```
- Cuando apareza una pregunta💬 responder con la letra (y)
  <section align="center">
       <img src="https://imgfz.com/i/4kH8tEw.jpeg" alt="npm_run_build">
  </section> 



## :white_check_mark: `Insertar roles en la base de datos`:gear:
- Ejecutar XAMPP y activar los servidores MySQL y Apache🖲️
- Abrir phpmyadmin
- En la base de datos (backendaj) abrir una nueva Query y ejecutar lo siguiente: 
  ```bash
    INSERT INTO `rol` (`id`,`rol_nombre`) VALUES (null,'ROLE_ADMIN') 
    INSERT INTO `rol` (`id`,`rol_nombre`) VALUES (null,'ROLE_USER')
  
  ```
  <!--ALTER TABLE bands MODIFY country_code VARCHAR(2) esto es por si jode las imagenes al cargar para aumentar los caracteres a 50-->
  <section align="center">
       <img src="https://imgfz.com/i/xuNmpoz.jpeg" alt="inserts">
  </section> 



## :white_check_mark: `Abrir Postman`:orange_circle:
- Con el XAMPP abierto, más los servidores activos (MySQL y Apache), abrir el NetBeans🔋
- Ejecutar el proyecto (backend) dentro de la carpeta " com.portfolioweb.aj ", click derecho al archivo AjAplication.java 👉 Run File
- Verificar que en la ventana " Output - Run (AjApplication) " se haya activado el servidor Tomcat Port:8080✔️
- Abrir postman🔶 para crear el usuario, logearlo, copiar su token y así poder crear la persona. También habrá que crear el banner.

### :heavy_check_mark: `Crear Usuario`:accessibility:
- Seleccionar POST y al lado escribir lo siguiente: 
  ```bash
    localhost:8080/auth/nuevo
  ```
- Debajo clickear donde dice Body, luego seleccionar " raw " y despues deplegar los formatos de texto y seleccionar el " JSON(application/json) "
- En la consola escribir: 
  ```bash
    {
      "nombre":"admin",
      "nombreUsuario":"admin",
      "email": "admin@admin.com",
      "password":"admin",
      "roles":["admin"]
    }
  ```
  *PD: los valores de todos los campos, menos el de "roles", pueden ser diferentes, esto es a modo de ejemplo*
  <section align="center">
       <img src="https://imgfz.com/i/G64F3aJ.jpeg" alt="Crear Usuario">
  </section> 



### :heavy_check_mark: `Obtener el Token`:beginner:
- Seleccionar POST y al lado escribir lo siguiente: 
  ```bash
    localhost:8080/auth/login
  ```
- Debajo clickear donde dice Body, luego seleccionar " raw " y despues deplegar los formatos de texto y seleccionar el " JSON(application/json) "
- En la consola escribir: 
  ```bash
    {
      "nombreUsuario":"admin",
      "password":"admin"
    }
  ```
- Luego de esto copiar el Bearer Token que se generó
  <section align="center">
       <img src="https://imgfz.com/i/BDfEbhk.jpeg" alt="Copiar Bearer Token">
  </section> 

### :heavy_check_mark: `Pegar Token en Authorization`:fleur_de_lis:
- Buscar en el menu de opciones donde dice Authorization
- Seleccionar Bearer Token --> Token y ahi pegar el Token copiado anteriormente
  <section align="center">
       <img src="https://imgfz.com/i/cQHfeYU.jpeg" alt="Pegar Token">
  </section> 


### :heavy_check_mark: `Crear persona que corresponde al usuario creado anteriormente`:restroom:
- Seleccionar POST y al lado escribir lo siguiente: 
  ```bash
    localhost:8080/persona/create
  ```
- Debajo clickear donde dice Body, luego seleccionar " raw " y despues deplegar los formatos de texto y seleccionar el " JSON(application/json) "
- En la consola escribir: 
  ```bash
    {
      "nombre":"Rigoberto", 
      "apellido": "Cangrejo",
      "img":"https://i.pinimg.com/564x/59/f3/97/59f39763e107715b7af08396c7032a2f.jpg",
      "profesion":"Software Developer",
      "acercaDe": "Soy el mejor programador de la historia"
    }
  ```
  *PD: los valores de todos los campos pueden ser diferentes, esto es a modo de ejemplo*
  <section align="center">
       <img src="https://imgfz.com/i/SGgRZjo.jpeg" alt="Crear persona">
  </section> 


  

### :heavy_check_mark: `Crear banner`:iphone:
- Seleccionar POST y al lado escribir lo siguiente: 
  ```bash
    localhost:8080/banner/create
  ```
- Debajo clickear donde dice Body, luego seleccionar " raw " y despues deplegar los formatos de texto y seleccionar el " JSON(application/json) "
- En la consola escribir: 
  ```bash
    {
      "titulo":"PORTFOLIO WEB",
      "img":"https://png.pngtree.com/background/20210714/original/pngtree-blue-realistic-carbon-fiber-light-background-banner-streaming-gaming-streamer-picture-image_1234220.jpg"
    }
  ```
  PD: los valores de todos los campos pueden ser diferentes, esto es a modo de ejemplo
  <section align="center">
       <img src="https://imgfz.com/i/Nj8e2MV.jpeg" alt="Crear banner">
  </section> 


## :ballot_box_with_check: `Ejecutar el sitio web por completo`:rocket:
### :heavy_check_mark: `Ejecutar BACKEND en NetBeans`:bar_chart:
- Con el XAMPP abierto, más los servidores activos (MySQL y Apache), abrir el NetBeans📍
- Ejecutar el proyecto (backend) dentro de la carpeta " com.portfolioweb.aj ", click derecho al archivo AjAplication.java 👉 Run File
- Verificar que en la ventana " Output - Run (AjApplication) " se haya activado el servidor Tomcat Port:8080✔️

### :heavy_check_mark: `Ejecutar FRONTEND en Visual Studio Code`:desktop_computer:
- Ir a la carpeta nueva📁 donde copiamos los archivos del " frontend_local " del repositorio, abrirla con el Visual Studio Code
- Abrir una nueva terminal y ejecutar el siguiente comando: 
  ```bash
    ng serve -o
  ```
  <section align="center">
       <img src="https://imgfz.com/i/JmBawiu.jpeg" alt="Sitio Web corriendo">
  </section> 

- Si todo salió bien🆗 se tiene que abrir una nueva pestaña en su navegador de Internet🌐 con el sitio web corriendo. 
  <section align="center">
       <img src="https://imgfz.com/i/LInQGeT.jpeg" alt="Sitio Web">
  </section>

- Para logearse🕳️ deberá introducir el nombre de usuario y su contraseña que se creo en Potsman anteriormente, para este ejemplo eran: 
  ```bash
    "nombreUsuario":admin
    "password":admin
  ```
  <section align="center">
       <img src="https://imgfz.com/i/mbw67yY.jpeg" alt="Login">
  </section>
- De esta forma podrá editar🖊️, eliminar❌ o agregar➕ información al sitio web
  <section align="center">
       <img src="https://imgfz.com/i/986yrVi.jpeg" alt="Acceso">
  </section>

## Sitio Web Online :globe_with_meridians:
  ```
    https://portfoliowebanajuarez.web.app/
  ```

## Tecnologías utilizadas :hammer_and_pick:

| [<img src="https://brandslogos.com/wp-content/uploads/images/large/java-logo-1.png" width=115><br><sub>Java</sub>](https://www.java.com/en/download/help/whatis_java.html) |  [<img src="https://styles.redditmedia.com/t5_2qm6k/styles/communityIcon_dhjr6guc03x51.png" width=115><br><sub>MySQL</sub>](https://www.ionos.es/digitalguide/servidores/know-how/que-es-mysql/#:~:text=MySQL%20es%20un%20sistema%20de,por%20ejemplo%2C%20WordPress%20y%20TYPO3.") |  [<img src="https://cdn-icons-png.flaticon.com/512/919/919825.png" width=115><br><sub>Node.js</sub>](https://nodejs.org/en/about) |  [<img src="https://techblog.istyle.co.jp/wp-content/uploads/2021/12/typescript.png" width=115><br><sub>TypeScript</sub>](https://www.typescriptlang.org/) | [<img src="https://brandslogos.com/wp-content/uploads/images/large/angular-icon-logo.png" width=115><br><sub>Angular</sub>](https://angular.io/) | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/1024px-HTML5_logo_and_wordmark.svg.png" width=115><br><sub>HTML</sub>](https://developer.mozilla.org/es/docs/Web/HTML) | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1200px-CSS3_logo_and_wordmark.svg.png" width=115><br><sub>CSS</sub>](https://developer.mozilla.org/es/docs/Web/CSS) | [<img src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/bootstrap-5-logo-icon.png" width=115><br><sub>Bootstrap</sub>](https://getbootstrap.com/docs/5.3/getting-started/introduction/) 
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | 
[<img src="https://static-00.iconduck.com/assets.00/postman-icon-497x512-beb7sy75.png" width=115><br><sub>Postman</sub>](https://www.postman.com/) |  [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png" width=115><br><sub>Visual Studio Code</sub>](https://code.visualstudio.com/) | [<img src="https://habrastorage.org/webt/wc/mn/um/wcmnum7pagecdfschlw9zu2kpf4.png" width=115><br><sub>XAMPP</sub>](https://www.apachefriends.org/es/index.html) | [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Apache_NetBeans_Logo.svg/444px-Apache_NetBeans_Logo.svg.png" width=115><br><sub>NetBeans</sub>](https://www.oracle.com/mx/tools/technologies/netbeans-ide.html#:~:text=NetBeans%20IDE%20es%20un%20entorno,las%20plataformas%20Java%20y%20HTML5.) | [<img src="https://www.techspot.com/images2/downloads/topdownload/2014/05/phpMyAdmin.png" width=115><br><sub>phpMyAdmin</sub>](https://www.arsys.es/blog/phpmyadmin) | [<img src="https://www.vincenzoracca.com/images/spring.png" width=115><br><sub>Spring Boot</sub>](https://spring.io/projects/spring-boot) |





## Autor :black_nib:
| [<img src="https://i.pinimg.com/564x/f3/0c/0c/f30c0cfba4eac4d9d9788357d483d497.jpg" width=115><br><sub>Ana Lucia Juarez</sub>](https://github.com/manita02) | 
| :---: |
 
