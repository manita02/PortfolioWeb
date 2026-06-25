package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoProyecto;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SProyecto;
import java.util.List;
import java.util.Optional;
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
@RequestMapping("proyecto")
@CrossOrigin(origins = "http://localhost:4200")
public class CProyecto {

    @Autowired
    private SProyecto sProyecto;

    @GetMapping("/lista")
    public ResponseEntity<List<dtoProyecto>> list() {
        return new ResponseEntity(sProyecto.list(), HttpStatus.OK);
    }

    @GetMapping("/actuales")
    public ResponseEntity<List<dtoProyecto>> listActuales() {
        return new ResponseEntity(sProyecto.listActuales(), HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") int id) {
        if (!sProyecto.existsById(id)) {
            return new ResponseEntity(new Mensaje("no existe"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(sProyecto.getOne(id).get(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoProyecto dtoproyecto) {
        Optional<String> validationError = sProyecto.validateDto(dtoproyecto, true);
        if (validationError.isPresent()) {
            return new ResponseEntity(new Mensaje(validationError.get()), HttpStatus.BAD_REQUEST);
        }

        if (sProyecto.existsByNombreE(dtoproyecto.getNombreE())) {
            return new ResponseEntity(new Mensaje("Ese proyecto ya existe"), HttpStatus.BAD_REQUEST);
        }

        dtoProyecto created = sProyecto.save(dtoproyecto);
        return new ResponseEntity(created, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoProyecto dtoproyecto) {
        if (!sProyecto.existsById(id)) {
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        }

        Optional<String> validationError = sProyecto.validateDto(dtoproyecto, false);
        if (validationError.isPresent()) {
            return new ResponseEntity(new Mensaje(validationError.get()), HttpStatus.BAD_REQUEST);
        }

        if (sProyecto.existsByNombreE(dtoproyecto.getNombreE())
                && sProyecto.getByNombreE(dtoproyecto.getNombreE()).get().getId() != id) {
            return new ResponseEntity(new Mensaje("Ese proyecto ya existe"), HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(sProyecto.update(id, dtoproyecto).get(), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id) {
        if (!sProyecto.existsById(id)) {
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        }
        sProyecto.delete(id);
        return new ResponseEntity(new Mensaje("Proyecto eliminado"), HttpStatus.OK);
    }
}
