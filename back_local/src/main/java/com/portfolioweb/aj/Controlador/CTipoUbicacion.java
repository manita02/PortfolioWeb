package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Entidad.TipoUbicacion;
import com.portfolioweb.aj.Servicio.STipoUbicacion;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tipo-ubicacion")
@CrossOrigin(origins = "http://localhost:4200")
public class CTipoUbicacion {

    @Autowired
    private STipoUbicacion sTipoUbicacion;

    @GetMapping("/lista")
    public ResponseEntity<List<TipoUbicacion>> list() {
        return new ResponseEntity(sTipoUbicacion.list(), HttpStatus.OK);
    }
}
