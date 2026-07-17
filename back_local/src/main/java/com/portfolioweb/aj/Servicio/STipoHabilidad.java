package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.TipoHabilidad;
import com.portfolioweb.aj.Repositorio.RTipoHabilidad;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class STipoHabilidad {

    @Autowired
    private RTipoHabilidad rTipoHabilidad;

    public List<TipoHabilidad> list() {
        return rTipoHabilidad.findAll();
    }

    public Optional<TipoHabilidad> getOne(int id) {
        return rTipoHabilidad.findById(id);
    }

    public boolean existsById(int id) {
        return rTipoHabilidad.existsById(id);
    }
}
