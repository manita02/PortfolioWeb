package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoOrganizacion;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SOrganizacion;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/organizacion")
@CrossOrigin(origins = "http://localhost:4200")
public class COrganizacion {

    @Autowired
    private SOrganizacion sOrganizacion;

    @GetMapping("/lista")
    public ResponseEntity<List<dtoOrganizacion>> list() {
        return new ResponseEntity(sOrganizacion.list(), HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (!sOrganizacion.existsById(id)) {
            return new ResponseEntity(new Mensaje("no existe"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(sOrganizacion.getOne(id).get(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoOrganizacion dto) {
        if (StringUtils.isBlank(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"), HttpStatus.BAD_REQUEST);
        }
        if (sOrganizacion.existsByNombre(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("Esa organizacion ya existe"), HttpStatus.BAD_REQUEST);
        }

        dtoOrganizacion created = sOrganizacion.save(dto);
        return new ResponseEntity(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody dtoOrganizacion dto) {
        if (!sOrganizacion.existsById(id)) {
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        }
        if (StringUtils.isBlank(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"), HttpStatus.BAD_REQUEST);
        }
        if (sOrganizacion.existsByNombre(dto.getNombre())
                && sOrganizacion.getByNombre(dto.getNombre()).get().getId().longValue() != id.longValue()) {
            return new ResponseEntity(new Mensaje("Esa organizacion ya existe"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(sOrganizacion.update(id, dto).get(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!sOrganizacion.existsById(id)) {
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        }
        sOrganizacion.delete(id);
        return new ResponseEntity(new Mensaje("Organizacion eliminada"), HttpStatus.OK);
    }
}
