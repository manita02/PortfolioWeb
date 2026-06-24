package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Entidad.TipoEmpleo;
import com.portfolioweb.aj.Servicio.STipoEmpleo;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tipo-empleo")
@CrossOrigin(origins = "http://localhost:4200")
public class CTipoEmpleo {

    @Autowired
    private STipoEmpleo sTipoEmpleo;

    @GetMapping("/lista")
    public ResponseEntity<List<TipoEmpleo>> list() {
        return new ResponseEntity(sTipoEmpleo.list(), HttpStatus.OK);
    }
}
