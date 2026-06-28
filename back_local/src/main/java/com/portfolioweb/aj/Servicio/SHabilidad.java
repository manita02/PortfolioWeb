package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoHabilidad;
import com.portfolioweb.aj.Dto.dtoTipoHabilidad;
import com.portfolioweb.aj.Entidad.Habilidad;
import com.portfolioweb.aj.Entidad.TipoHabilidad;
import com.portfolioweb.aj.Excepcion.ArchivoInvalidoException;
import com.portfolioweb.aj.Repositorio.RHabilidad;
import com.portfolioweb.aj.Repositorio.RTipoHabilidad;
import com.portfolioweb.aj.Util.ArchivoUtil;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SHabilidad {

    @Autowired
    private RHabilidad rHabilidad;

    @Autowired
    private RTipoHabilidad rTipoHabilidad;

    public List<dtoHabilidad> list() {
        return rHabilidad.findAllByOrderByIdDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoHabilidad> getOne(int id) {
        return rHabilidad.findById(id).map(this::toDto);
    }

    public Optional<Habilidad> getEntity(int id) {
        return rHabilidad.findById(id);
    }

    public Optional<Habilidad> getByNombre(String nombre) {
        return rHabilidad.findByNombre(nombre);
    }

    public void save(Habilidad habilidad) {
        rHabilidad.save(habilidad);
    }

    public void delete(int id) {
        rHabilidad.deleteById(id);
    }

    public boolean existsById(int id) {
        return rHabilidad.existsById(id);
    }

    public boolean existsByNombre(String nombre) {
        return rHabilidad.existsByNombre(nombre);
    }

    public boolean existsTipoHabilidad(Integer tipoHabilidadId) {
        return tipoHabilidadId != null && rTipoHabilidad.existsById(tipoHabilidadId);
    }

    public Habilidad mapToEntity(dtoHabilidad dto, Habilidad habilidad, boolean isCreate) {
        habilidad.setNombre(dto.getNombre());
        TipoHabilidad tipoHabilidad = rTipoHabilidad.findById(dto.getTipoHabilidadId()).orElse(null);
        habilidad.setTipoHabilidad(tipoHabilidad);
        if (isCreate || StringUtils.isNotBlank(dto.getImg())) {
            ArchivoUtil.ResultadoArchivo resultado = ArchivoUtil.procesarImagen(dto.getImg());
            if (resultado.tieneError()) {
                throw new ArchivoInvalidoException(resultado.getMensajeError());
            }
            habilidad.setImg(resultado.getBytes());
        }
        return habilidad;
    }

    public dtoHabilidad toDto(Habilidad habilidad) {
        dtoHabilidad dto = new dtoHabilidad();
        dto.setId(habilidad.getId());
        dto.setNombre(habilidad.getNombre());
        dto.setImg(ArchivoUtil.codificarBase64(habilidad.getImg()));
        if (habilidad.getTipoHabilidad() != null) {
            dto.setTipoHabilidadId(habilidad.getTipoHabilidad().getId());
            dto.setTipoHabilidad(toTipoDto(habilidad.getTipoHabilidad()));
        }
        return dto;
    }

    public dtoTipoHabilidad toTipoDto(TipoHabilidad tipoHabilidad) {
        return new dtoTipoHabilidad(tipoHabilidad.getId(), tipoHabilidad.getNombre());
    }
}
