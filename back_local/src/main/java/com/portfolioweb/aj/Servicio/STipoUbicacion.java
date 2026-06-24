package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.TipoUbicacion;
import com.portfolioweb.aj.Repositorio.RTipoUbicacion;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class STipoUbicacion {

    @Autowired
    private RTipoUbicacion rTipoUbicacion;

    public List<TipoUbicacion> list() {
        return rTipoUbicacion.findAll();
    }

    public Optional<TipoUbicacion> getOne(Long id) {
        return rTipoUbicacion.findById(id);
    }

    public boolean existsById(Long id) {
        return rTipoUbicacion.existsById(id);
    }
}
