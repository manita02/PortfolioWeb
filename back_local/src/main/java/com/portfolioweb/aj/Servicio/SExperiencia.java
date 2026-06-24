package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoExperiencia;
import com.portfolioweb.aj.Dto.dtoHabilidades;
import com.portfolioweb.aj.Dto.dtoTipoEmpleo;
import com.portfolioweb.aj.Dto.dtoTipoUbicacion;
import com.portfolioweb.aj.Entidad.Experiencia;
import com.portfolioweb.aj.Entidad.Habilidades;
import com.portfolioweb.aj.Entidad.Organizacion;
import com.portfolioweb.aj.Entidad.TipoEmpleo;
import com.portfolioweb.aj.Entidad.TipoUbicacion;
import com.portfolioweb.aj.Repositorio.RExperiencia;
import com.portfolioweb.aj.Repositorio.RHabilidades;
import com.portfolioweb.aj.Repositorio.ROrganizacion;
import com.portfolioweb.aj.Repositorio.RTipoEmpleo;
import com.portfolioweb.aj.Repositorio.RTipoUbicacion;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SExperiencia {

    private static final Pattern FECHA_MES_ANIO = Pattern.compile("^(0[1-9]|1[0-2])/\\d{4}$");

    @Autowired
    private RExperiencia rExperiencia;

    @Autowired
    private RTipoEmpleo rTipoEmpleo;

    @Autowired
    private RTipoUbicacion rTipoUbicacion;

    @Autowired
    private ROrganizacion rOrganizacion;

    @Autowired
    private RHabilidades rHabilidades;

    @Autowired
    private SOrganizacion sOrganizacion;

    public List<dtoExperiencia> list() {
        return rExperiencia.findAllWithRelations().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoExperiencia> getOne(int id) {
        return rExperiencia.findByIdWithRelations(id).map(this::toDto);
    }

    public Optional<Experiencia> getByNombreE(String nombreE) {
        return rExperiencia.findByNombreE(nombreE);
    }

    public dtoExperiencia save(dtoExperiencia dto) {
        Experiencia experiencia = mapToEntity(new Experiencia(), dto);
        return toDto(rExperiencia.save(experiencia));
    }

    public Optional<dtoExperiencia> update(int id, dtoExperiencia dto) {
        return rExperiencia.findById(id).map(experiencia -> {
            mapToEntity(experiencia, dto);
            return toDto(rExperiencia.save(experiencia));
        });
    }

    public void delete(int id) {
        rExperiencia.deleteById(id);
    }

    public boolean existsById(int id) {
        return rExperiencia.existsById(id);
    }

    public boolean existsByNombreE(String nombreE) {
        return rExperiencia.existsByNombreE(nombreE);
    }

    public List<dtoExperiencia> listActuales() {
        return rExperiencia.findByEsActualTrue().stream()
                .map(experiencia -> rExperiencia.findByIdWithRelations(experiencia.getId()).orElse(experiencia))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<String> validateDto(dtoExperiencia dto) {
        if (StringUtils.isBlank(dto.getNombreE())) {
            return Optional.of("El nombre es obligatorio");
        }
        if (StringUtils.isBlank(dto.getDescripcionE())) {
            return Optional.of("La descripcion es obligatoria");
        }
        if (StringUtils.isBlank(dto.getFechaInicio()) || !FECHA_MES_ANIO.matcher(dto.getFechaInicio()).matches()) {
            return Optional.of("La fecha de inicio debe tener formato MM/yyyy");
        }
        if (dto.isEsActual()) {
            if (StringUtils.isNotBlank(dto.getFechaFin())) {
                return Optional.of("Si es actual, la fecha de fin debe ser nula");
            }
        } else if (StringUtils.isBlank(dto.getFechaFin()) || !FECHA_MES_ANIO.matcher(dto.getFechaFin()).matches()) {
            return Optional.of("La fecha de fin debe tener formato MM/yyyy");
        }
        if (dto.getTipoEmpleoId() == null || !rTipoEmpleo.existsById(dto.getTipoEmpleoId())) {
            return Optional.of("El tipo de empleo no existe");
        }
        if (dto.getTipoUbicacionId() == null || !rTipoUbicacion.existsById(dto.getTipoUbicacionId())) {
            return Optional.of("El tipo de ubicacion no existe");
        }
        if (dto.getOrganizacionId() == null || !rOrganizacion.existsById(dto.getOrganizacionId())) {
            return Optional.of("La organizacion no existe");
        }
        if (dto.getHabilidadesIds() != null) {
            for (Integer habilidadId : dto.getHabilidadesIds()) {
                if (habilidadId == null || !rHabilidades.existsById(habilidadId)) {
                    return Optional.of("Una o mas habilidades no existen");
                }
            }
        }
        return Optional.empty();
    }

    private Experiencia mapToEntity(Experiencia experiencia, dtoExperiencia dto) {
        experiencia.setNombreE(dto.getNombreE());
        experiencia.setDescripcionE(dto.getDescripcionE());
        experiencia.setEsActual(dto.isEsActual());
        experiencia.setFechaInicio(dto.getFechaInicio());
        experiencia.setFechaFin(dto.isEsActual() ? null : dto.getFechaFin());

        TipoEmpleo tipoEmpleo = rTipoEmpleo.findById(dto.getTipoEmpleoId()).orElse(null);
        TipoUbicacion tipoUbicacion = rTipoUbicacion.findById(dto.getTipoUbicacionId()).orElse(null);
        Organizacion organizacion = rOrganizacion.findById(dto.getOrganizacionId()).orElse(null);

        experiencia.setTipoEmpleo(tipoEmpleo);
        experiencia.setTipoUbicacion(tipoUbicacion);
        experiencia.setOrganizacion(organizacion);
        experiencia.setHabilidades(resolveHabilidades(dto.getHabilidadesIds()));

        return experiencia;
    }

    private List<Habilidades> resolveHabilidades(List<Integer> habilidadesIds) {
        if (habilidadesIds == null || habilidadesIds.isEmpty()) {
            return new ArrayList<>();
        }
        return habilidadesIds.stream()
                .map(rHabilidades::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    public dtoExperiencia toDto(Experiencia experiencia) {
        dtoExperiencia dto = new dtoExperiencia();
        dto.setId(experiencia.getId());
        dto.setNombreE(experiencia.getNombreE());
        dto.setDescripcionE(experiencia.getDescripcionE());
        dto.setEsActual(experiencia.isEsActual());
        dto.setFechaInicio(experiencia.getFechaInicio());
        dto.setFechaFin(experiencia.getFechaFin());

        if (experiencia.getTipoEmpleo() != null) {
            dto.setTipoEmpleoId(experiencia.getTipoEmpleo().getId());
            dto.setTipoEmpleo(new dtoTipoEmpleo(
                    experiencia.getTipoEmpleo().getId(),
                    experiencia.getTipoEmpleo().getNombre()
            ));
        }

        if (experiencia.getTipoUbicacion() != null) {
            dto.setTipoUbicacionId(experiencia.getTipoUbicacion().getId());
            dto.setTipoUbicacion(new dtoTipoUbicacion(
                    experiencia.getTipoUbicacion().getId(),
                    experiencia.getTipoUbicacion().getNombre()
            ));
        }

        if (experiencia.getOrganizacion() != null) {
            dto.setOrganizacionId(experiencia.getOrganizacion().getId());
            dto.setOrganizacion(sOrganizacion.toDto(experiencia.getOrganizacion()));
        }

        if (experiencia.getHabilidades() != null) {
            dto.setHabilidadesIds(experiencia.getHabilidades().stream()
                    .map(Habilidades::getId)
                    .collect(Collectors.toList()));
            dto.setHabilidades(experiencia.getHabilidades().stream()
                    .map(this::toHabilidadDto)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    private dtoHabilidades toHabilidadDto(Habilidades habilidad) {
        dtoHabilidades dto = new dtoHabilidades();
        dto.setId(habilidad.getId());
        dto.setNombreH(habilidad.getNombreH());
        dto.setPorcentaje(habilidad.getPorcentaje());
        dto.setImg(habilidad.getImg());
        return dto;
    }
}
