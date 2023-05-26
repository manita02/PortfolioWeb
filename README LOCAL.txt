

1- Hay que descargar (desde el navegador web) en instalar GIT (darle a todo siguiente)
	link para descargar: https://git-scm.com/downloads

2- crear una nueva carpeta en cualquir lado para clonar el repositorio.. luego click derecho git bash here 

3- ahora hay que ir a el link donde esta el repositorio en github: 
	link: https://github.com/manita02/APLOCAL 
	clickear donde dice code... despues donde dice clone seleccionar https y copiar el enlace 

4- volvemos a la consola de git... 
	ejecutar git init
	""	 git clone "y el enlace copiado anteriormente sin las comillas"

5- ahora hay que descargar e instalar(en ese orden)... 
	el visual studio code
	el node js (recomendada o actual da lo mismo) --> https://nodejs.org/es
	mysql comunnity (para el uso del workbench)
	xampp  ---> https://www.apachefriends.org/es/download.html
	apache neatbeans ----> https://www.youtube.com/watch?v=mq0_LX_vmsA&t=57s
		(requiere instalacion de java, jdk8 y neatebans obvio)... el jdk8 lo tengo q poner en un rar o algo o en github
	potsman

6- luego ir al buscador de windows y escrbir cmd.. click derecho ejecutar como administrador: 
	una vez dentro de la consola escrbir el comando: npm install -g @angular/cli@latest -----> instala la ultima version de angular cli dentro del sistema

7- abrir xampp y cliclear apache y mysql 

8- ir al workbench y crear una base de datos de backendaj.. sin ninguna tabla ---> hay que hacerlo en workbench


9- ir al link start.spring.io   ---> video youtube: https://www.youtube.com/watch?v=r_qC9WLjUm8&list=PLly5egcQSlfmDzqF4Of944eD2VPXxua42&index=15 -----> apartir del minuto 7
	seleccionar maven project 
	language java
	version sprin boot: 2.6.7 // eleji la mas baja xq ya no esta esa opcion
	group: com.portfolio 
	artifact/name: aj
	description: portfolio de mgb 
	package name: com.portfolio.aj 
	packaging: jar
	java: 8
	

	agregar dependencias: 
		spring web
		spring data jpa
		mysql driver 
		validation 
		spring boot devtools 
		lombok 
		
	despues dar en generar..

10- esa carpeta generada copiarla a documentos... ahi dentro meter y sobreescribir los arhivos que tiene back_local 

11- abrir neatbeans y buscar el proyecto dentro de neatbens projects 

12- click derecho sobre el proyecto y resolve problems.. luego apretar resolve 

13- si hay contraseña del usuario root cambiarla en application properties que esta en other resources.. y si no tenes, borrar la linea de password



- crear una carpeta nueva con cualquier nombre.. que este vacia
abrir esa carpeta con el vscode.. luego la terminal (fijarse bien que este ubicada en esa carpeta, sino meterle al cd: hasta en encontrar la ubicacion)
	 y ejecutar el comando: ng new "nombre del proyecto sin comillas" ------> https://www.youtube.com/watch?v=NGYPVSWzrwo&list=PLly5egcQSlfmDzqF4Of944eD2VPXxua42&index=2 ---> apartir del minuto 4
	luego apretar la letra (y) y luego enter 
	luego elejir css y enter
- despues copiar los archivos que hay en front local a esta carpeta y volverla a abrir con el vscode
- ejecutar npm install.. si esto tira errores.. volver a cmd como administrador y ejecutar esto: npm i -g npm@8.5.1 
- si dice ejecutar npm audit fix.. hacerlo por lo menos una vez
luego ng serve -o 

parece q va.. 
ir al gestor de base de datos puede ser workbench o phpmyadmin y ejecutar esto: 
INSERT INTO `rol` (`id`,`rol_nombre`) VALUES (null,'ROLE_ADMIN') 
INSERT INTO `rol` (`id`,`rol_nombre`) VALUES (null,'ROLE_USER')

ahora hay que descargar postman... para crear un usuario, logearse, copiar el token y luego crear la persona, despues tambien hay que crear el banner

hay que ejecutar xampp en mysql y apache

abrir netabeans y ejecutar el proyecto (click derecho a AjAplicattion)

que se ejecute en Tomcat Port:8080 

abrir potsman (todo lo que se crea en POST) ---> todo explicado en: https://www.youtube.com/watch?v=q8i5pIoBfgI&list=PLly5egcQSlfmDzqF4Of944eD2VPXxua42&index=20  (a partir de la hora_ 2:15:00hs)

primero: 

localhost:8080/auth/nuevo ---> ahi hacemos primero para user y despues para admin 

localhost:8080/auth/login ---> ponemos nombre y contraseña para entrar a editar.. genera el token hay que copiarlo

localhost:8080/persona/create --> creo mi persona con mis datos 

localhost:8080/banner/create ---> mando el banner 

todos los campos de textos descriptivos largos como los links de las imagenes, puede que no se muestren xq hay que aumentar el tamaño del dato en la base de datos 

listo queda ir al vscode ubicar la carpeta del front ejecutar ng serve -o y magia


