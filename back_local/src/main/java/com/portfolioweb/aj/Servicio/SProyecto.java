package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoProyecto;
import com.portfolioweb.aj.Entidad.Habilidad;
import com.portfolioweb.aj.Entidad.Organizacion;
import com.portfolioweb.aj.Entidad.Proyecto;
import com.portfolioweb.aj.Repositorio.RHabilidad;
import com.portfolioweb.aj.Repositorio.ROrganizacion;
import com.portfolioweb.aj.Repositorio.RProyecto;
import java.util.ArrayList;
import java.util.Base64;
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
public class SProyecto {

    private static final Pattern FECHA_MES_ANIO = Pattern.compile("^(0[1-9]|1[0-2])/\\d{4}$");

    @Autowired
    private RProyecto rProyecto;

    @Autowired
    private ROrganizacion rOrganizacion;

    @Autowired
    private RHabilidad rHabilidad;

    @Autowired
    private SHabilidad sHabilidad;

    @Autowired
    private SOrganizacion sOrganizacion;

    public List<dtoProyecto> list() {
        return rProyecto.findAllWithRelations().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoProyecto> getOne(int id) {
        return rProyecto.findByIdWithRelations(id).map(this::toDto);
    }

    public Optional<Proyecto> getByNombreE(String nombreE) {
        return rProyecto.findByNombreE(nombreE);
    }

    public dtoProyecto save(dtoProyecto dto) {
        Proyecto proyecto = mapToEntity(new Proyecto(), dto, true);
        return toDto(rProyecto.save(proyecto));
    }

    public Optional<dtoProyecto> update(int id, dtoProyecto dto) {
        return rProyecto.findById(id).map(proyecto -> {
            mapToEntity(proyecto, dto, false);
            return toDto(rProyecto.save(proyecto));
        });
    }

    public void delete(int id) {
        rProyecto.deleteById(id);
    }

    public boolean existsById(int id) {
        return rProyecto.existsById(id);
    }

    public boolean existsByNombreE(String nombreE) {
        return rProyecto.existsByNombreE(nombreE);
    }

    public List<dtoProyecto> listActuales() {
        return rProyecto.findByEsActualTrue().stream()
                .map(proyecto -> rProyecto.findByIdWithRelations(proyecto.getId()).orElse(proyecto))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<String> validateDto(dtoProyecto dto, boolean isCreate) {
        if (StringUtils.isBlank(dto.getNombreE())) {
            return Optional.of("El nombre es obligatorio");
        }
        if (StringUtils.isBlank(dto.getDescripcionE())) {
            return Optional.of("La descripcion es obligatoria");
        }
        if (StringUtils.isBlank(dto.getLink())) {
            return Optional.of("La URL es obligatoria");
        }
        if (isCreate && StringUtils.isBlank(dto.getImagen())) {
            return Optional.of("La imagen es obligatoria");
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
        if (dto.getOrganizacionId() != null && !rOrganizacion.existsById(dto.getOrganizacionId())) {
            return Optional.of("La organizacion no existe");
        }
        if (dto.getHabilidadesIds() != null) {
            for (Integer habilidadId : dto.getHabilidadesIds()) {
                if (habilidadId == null || !rHabilidad.existsById(habilidadId)) {
                    return Optional.of("Una o mas habilidades no existen");
                }
            }
        }
        return Optional.empty();
    }

    private Proyecto mapToEntity(Proyecto proyecto, dtoProyecto dto, boolean isCreate) {
        proyecto.setNombreE(dto.getNombreE());
        proyecto.setDescripcionE(dto.getDescripcionE());
        proyecto.setLink(dto.getLink());
        proyecto.setEsActual(dto.isEsActual());
        proyecto.setFechaInicio(dto.getFechaInicio());
        proyecto.setFechaFin(dto.isEsActual() ? null : dto.getFechaFin());

        if (dto.getOrganizacionId() != null) {
            Organizacion organizacion = rOrganizacion.findById(dto.getOrganizacionId()).orElse(null);
            proyecto.setOrganizacion(organizacion);
        } else {
            proyecto.setOrganizacion(null);
        }

        proyecto.setHabilidades(resolveHabilidades(dto.getHabilidadesIds()));

        if (isCreate || StringUtils.isNotBlank(dto.getImagen())) {
            proyecto.setImagen(decodeBase64(dto.getImagen()));
        }

        return proyecto;
    }

    private List<Habilidad> resolveHabilidades(List<Integer> habilidadesIds) {
        if (habilidadesIds == null || habilidadesIds.isEmpty()) {
            return new ArrayList<>();
        }
        return habilidadesIds.stream()
                .map(rHabilidad::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
    }

    public dtoProyecto toDto(Proyecto proyecto) {
        dtoProyecto dto = new dtoProyecto();
        dto.setId(proyecto.getId());
        dto.setNombreE(proyecto.getNombreE());
        dto.setDescripcionE(proyecto.getDescripcionE());
        dto.setLink(proyecto.getLink());
        dto.setEsActual(proyecto.isEsActual());
        dto.setFechaInicio(proyecto.getFechaInicio());
        dto.setFechaFin(proyecto.getFechaFin());

        if (proyecto.getOrganizacion() != null) {
            dto.setOrganizacionId(proyecto.getOrganizacion().getId());
            dto.setOrganizacion(sOrganizacion.toDto(proyecto.getOrganizacion()));
        }

        if (proyecto.getHabilidades() != null) {
            dto.setHabilidadesIds(proyecto.getHabilidades().stream()
                    .map(Habilidad::getId)
                    .collect(Collectors.toList()));
            dto.setHabilidades(proyecto.getHabilidades().stream()
                    .map(sHabilidad::toDto)
                    .collect(Collectors.toList()));
        }

        dto.setImagen(encodeBase64(proyecto.getImagen()));

        return dto;
    }

    private byte[] decodeBase64(String base64) {
        if (StringUtils.isBlank(base64)) {
            return null;
        }
        String data = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
        return Base64.getDecoder().decode(data.trim());
    }

    private String encodeBase64(byte[] data) {
        if (data == null || data.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(data);
    }
}
