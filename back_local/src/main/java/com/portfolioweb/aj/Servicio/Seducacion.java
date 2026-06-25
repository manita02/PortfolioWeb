package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoEducacion;
import com.portfolioweb.aj.Dto.dtoHabilidades;
import com.portfolioweb.aj.Dto.dtoTipoEducacion;
import com.portfolioweb.aj.Entidad.Educacion;
import com.portfolioweb.aj.Entidad.Habilidades;
import com.portfolioweb.aj.Entidad.Organizacion;
import com.portfolioweb.aj.Entidad.TipoEducacion;
import com.portfolioweb.aj.Repositorio.REduacion;
import com.portfolioweb.aj.Repositorio.RHabilidades;
import com.portfolioweb.aj.Repositorio.ROrganizacion;
import com.portfolioweb.aj.Repositorio.RTipoEducacion;
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
public class SEducacion {

    private static final Pattern FECHA_MES_ANIO = Pattern.compile("^(0[1-9]|1[0-2])/\\d{4}$");

    @Autowired
    private REduacion rEducacion;

    @Autowired
    private RTipoEducacion rTipoEducacion;

    @Autowired
    private ROrganizacion rOrganizacion;

    @Autowired
    private RHabilidades rHabilidades;

    @Autowired
    private SOrganizacion sOrganizacion;

    public List<dtoEducacion> list() {
        return rEducacion.findAllWithRelations().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoEducacion> getOne(int id) {
        return rEducacion.findByIdWithRelations(id).map(this::toDto);
    }

    public Optional<Educacion> getByNombreE(String nombreE) {
        return rEducacion.findByNombreE(nombreE);
    }

    public dtoEducacion save(dtoEducacion dto) {
        Educacion educacion = mapToEntity(new Educacion(), dto, true);
        return toDto(rEducacion.save(educacion));
    }

    public Optional<dtoEducacion> update(int id, dtoEducacion dto) {
        return rEducacion.findById(id).map(educacion -> {
            mapToEntity(educacion, dto, false);
            return toDto(rEducacion.save(educacion));
        });
    }

    public void delete(int id) {
        rEducacion.deleteById(id);
    }

    public boolean existsById(int id) {
        return rEducacion.existsById(id);
    }

    public boolean existsByNombreE(String nombreE) {
        return rEducacion.existsByNombreE(nombreE);
    }

    public Optional<String> validateDto(dtoEducacion dto) {
        if (StringUtils.isBlank(dto.getNombreE())) {
            return Optional.of("El nombre es obligatorio");
        }
        if (StringUtils.isBlank(dto.getDescripcionE())) {
            return Optional.of("La descripcion es obligatoria");
        }
        if (StringUtils.isBlank(dto.getFechaInicio()) || !FECHA_MES_ANIO.matcher(dto.getFechaInicio()).matches()) {
            return Optional.of("La fecha de inicio debe tener formato MM/yyyy");
        }
        if (StringUtils.isNotBlank(dto.getFechaFin()) && !FECHA_MES_ANIO.matcher(dto.getFechaFin()).matches()) {
            return Optional.of("La fecha de fin debe tener formato MM/yyyy");
        }
        if (dto.getTipoEducacionId() == null || !rTipoEducacion.existsById(dto.getTipoEducacionId())) {
            return Optional.of("El tipo de educacion no existe");
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

    private Educacion mapToEntity(Educacion educacion, dtoEducacion dto, boolean isCreate) {
        educacion.setNombreE(dto.getNombreE());
        educacion.setDescripcionE(dto.getDescripcionE());
        educacion.setFechaInicio(dto.getFechaInicio());
        educacion.setFechaFin(StringUtils.isBlank(dto.getFechaFin()) ? null : dto.getFechaFin());

        TipoEducacion tipoEducacion = rTipoEducacion.findById(dto.getTipoEducacionId()).orElse(null);
        Organizacion organizacion = rOrganizacion.findById(dto.getOrganizacionId()).orElse(null);

        educacion.setTipoEducacion(tipoEducacion);
        educacion.setOrganizacion(organizacion);
        educacion.setHabilidades(resolveHabilidades(dto.getHabilidadesIds()));

        if (isCreate || StringUtils.isNotBlank(dto.getArchivoImagen())) {
            educacion.setArchivoImagen(decodeBase64(dto.getArchivoImagen()));
        }
        if (isCreate || StringUtils.isNotBlank(dto.getArchivoPdf())) {
            educacion.setArchivoPdf(decodeBase64(dto.getArchivoPdf()));
        }

        return educacion;
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

    public dtoEducacion toDto(Educacion educacion) {
        dtoEducacion dto = new dtoEducacion();
        dto.setId(educacion.getId());
        dto.setNombreE(educacion.getNombreE());
        dto.setDescripcionE(educacion.getDescripcionE());
        dto.setFechaInicio(educacion.getFechaInicio());
        dto.setFechaFin(educacion.getFechaFin());

        if (educacion.getTipoEducacion() != null) {
            dto.setTipoEducacionId(educacion.getTipoEducacion().getId());
            dto.setTipoEducacion(new dtoTipoEducacion(
                    educacion.getTipoEducacion().getId(),
                    educacion.getTipoEducacion().getNombre()
            ));
        }

        if (educacion.getOrganizacion() != null) {
            dto.setOrganizacionId(educacion.getOrganizacion().getId());
            dto.setOrganizacion(sOrganizacion.toDto(educacion.getOrganizacion()));
        }

        if (educacion.getHabilidades() != null) {
            dto.setHabilidadesIds(educacion.getHabilidades().stream()
                    .map(Habilidades::getId)
                    .collect(Collectors.toList()));
            dto.setHabilidades(educacion.getHabilidades().stream()
                    .map(this::toHabilidadDto)
                    .collect(Collectors.toList()));
        }

        dto.setArchivoImagen(encodeBase64(educacion.getArchivoImagen()));
        dto.setArchivoPdf(encodeBase64(educacion.getArchivoPdf()));

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
