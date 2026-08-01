package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.StaticExportResult;
import com.portfolioweb.aj.Servicio.SStaticExport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/static-export")
@CrossOrigin(origins = "http://localhost:4200")
public class CStaticExport {

    @Autowired
    private SStaticExport sStaticExport;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/generate")
    public ResponseEntity<StaticExportResult> generate() {
        return new ResponseEntity<>(sStaticExport.exportar(), HttpStatus.OK);
    }
}
