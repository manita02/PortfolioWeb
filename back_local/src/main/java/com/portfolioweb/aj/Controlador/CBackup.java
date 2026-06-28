package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SBackup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/backup")
@CrossOrigin(origins = "http://localhost:4200")
public class CBackup {

    @Autowired
    private SBackup sBackup;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/upload")
    public ResponseEntity<Mensaje> upload(@RequestParam("file") MultipartFile file) {
        sBackup.restaurarDesdeArchivo(file);
        return new ResponseEntity<>(
                new Mensaje("Backup restaurado correctamente"),
                HttpStatus.OK
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/download")
    public ResponseEntity<Resource> download() {
        byte[] contenido = sBackup.generarScriptSql();
        String nombreArchivo = sBackup.generarNombreArchivoDescarga();

        ByteArrayResource resource = new ByteArrayResource(contenido);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/sql"));
        headers.setContentDispositionFormData("attachment", nombreArchivo);
        headers.setContentLength(contenido.length);

        return new ResponseEntity<Resource>(resource, headers, HttpStatus.OK);
    }
}
