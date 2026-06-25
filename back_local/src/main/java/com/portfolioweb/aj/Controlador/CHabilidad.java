package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoHabilidad;
import com.portfolioweb.aj.Entidad.Habilidad;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SHabilidad;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/habilidades")
@CrossOrigin(origins = "http://localhost:4200")
public class CHabilidad {

    @Autowired
    private SHabilidad sHabilidad;

    @GetMapping("/lista")
    public ResponseEntity<List<dtoHabilidad>> list() {
        return new ResponseEntity(sHabilidad.list(), HttpStatus.OK);
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id) {
        if (!sHabilidad.existsById(id)) {
            return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity(sHabilidad.getOne(id).get(), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") Long id) {
        if (!sHabilidad.existsById(id)) {
            return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND);
        }
        sHabilidad.delete(id);
        return new ResponseEntity(new Mensaje("Habilidad eliminada"), HttpStatus.OK);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoHabilidad dto) {
        if (StringUtils.isBlank(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"), HttpStatus.BAD_REQUEST);
        }
        if (StringUtils.isBlank(dto.getImg())) {
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"), HttpStatus.BAD_REQUEST);
        }
        if (!sHabilidad.existsTipoHabilidad(dto.getTipoHabilidadId())) {
            return new ResponseEntity(new Mensaje("El tipo de habilidad no existe"), HttpStatus.BAD_REQUEST);
        }
        if (sHabilidad.existsByNombre(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST);
        }

        Habilidad habilidad = new Habilidad();
        sHabilidad.mapToEntity(dto, habilidad, true);
        sHabilidad.save(habilidad);
        return new ResponseEntity(new Mensaje("Habilidad creada"), HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") Long id, @RequestBody dtoHabilidad dto) {
        if (!sHabilidad.existsById(id)) {
            return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND);
        }
        if (sHabilidad.existsByNombre(dto.getNombre())
                && sHabilidad.getByNombre(dto.getNombre()).get().getId().longValue() != id.longValue()) {
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST);
        }
        if (StringUtils.isBlank(dto.getNombre())) {
            return new ResponseEntity(new Mensaje("El campo no puede estar vacío"), HttpStatus.BAD_REQUEST);
        }
        if (!sHabilidad.existsTipoHabilidad(dto.getTipoHabilidadId())) {
            return new ResponseEntity(new Mensaje("El tipo de habilidad no existe"), HttpStatus.BAD_REQUEST);
        }

        Habilidad habilidad = sHabilidad.getEntity(id).get();
        sHabilidad.mapToEntity(dto, habilidad, false);
        sHabilidad.save(habilidad);
        return new ResponseEntity(new Mensaje("Habilidad actualizada"), HttpStatus.OK);
    }
}
