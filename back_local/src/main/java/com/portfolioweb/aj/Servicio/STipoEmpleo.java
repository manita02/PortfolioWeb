package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.TipoEmpleo;
import com.portfolioweb.aj.Repositorio.RTipoEmpleo;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class STipoEmpleo {

    @Autowired
    private RTipoEmpleo rTipoEmpleo;

    public List<TipoEmpleo> list() {
        return rTipoEmpleo.findAll();
    }

    public Optional<TipoEmpleo> getOne(int id) {
        return rTipoEmpleo.findById(id);
    }

    public boolean existsById(int id) {
        return rTipoEmpleo.existsById(id);
    }
}
