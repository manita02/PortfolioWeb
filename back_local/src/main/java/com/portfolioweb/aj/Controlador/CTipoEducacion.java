package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Entidad.TipoEducacion;
import com.portfolioweb.aj.Servicio.STipoEducacion;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tipo-educacion")
@CrossOrigin(origins = "http://localhost:4200")
public class CTipoEducacion {

    @Autowired
    private STipoEducacion sTipoEducacion;

    @GetMapping("/lista")
    public ResponseEntity<List<TipoEducacion>> list() {
        return new ResponseEntity(sTipoEducacion.list(), HttpStatus.OK);
    }
}
