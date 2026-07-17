package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.TipoEducacion;
import com.portfolioweb.aj.Repositorio.RTipoEducacion;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class STipoEducacion {

    @Autowired
    private RTipoEducacion rTipoEducacion;

    public List<TipoEducacion> list() {
        return rTipoEducacion.findAll();
    }

    public Optional<TipoEducacion> getOne(int id) {
        return rTipoEducacion.findById(id);
    }

    public boolean existsById(int id) {
        return rTipoEducacion.existsById(id);
    }
}
