package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Entidad.TipoHabilidad;
import com.portfolioweb.aj.Servicio.STipoHabilidad;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tipo-habilidad")
@CrossOrigin(origins = "http://localhost:4200")
public class CTipoHabilidad {

    @Autowired
    private STipoHabilidad sTipoHabilidad;

    @GetMapping("/lista")
    public ResponseEntity<List<TipoHabilidad>> list() {
        return new ResponseEntity(sTipoHabilidad.list(), HttpStatus.OK);
    }
}
