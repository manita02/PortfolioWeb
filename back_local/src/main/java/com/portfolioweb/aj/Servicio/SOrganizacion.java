package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoOrganizacion;
import com.portfolioweb.aj.Entidad.Organizacion;
import com.portfolioweb.aj.Repositorio.ROrganizacion;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SOrganizacion {

    @Autowired
    private ROrganizacion rOrganizacion;

    public List<dtoOrganizacion> list() {
        return rOrganizacion.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoOrganizacion> getOne(Long id) {
        return rOrganizacion.findById(id).map(this::toDto);
    }

    public dtoOrganizacion save(dtoOrganizacion dto) {
        Organizacion organizacion = new Organizacion(
                dto.getNombre(),
                dto.getUbicacion(),
                dto.getUrlWeb(),
                decodeLogo(dto.getLogoImg())
        );
        return toDto(rOrganizacion.save(organizacion));
    }

    public Optional<dtoOrganizacion> update(Long id, dtoOrganizacion dto) {
        return rOrganizacion.findById(id).map(organizacion -> {
            organizacion.setNombre(dto.getNombre());
            organizacion.setUbicacion(dto.getUbicacion());
            organizacion.setUrlWeb(dto.getUrlWeb());
            if (StringUtils.isNotBlank(dto.getLogoImg())) {
                organizacion.setLogoImg(decodeLogo(dto.getLogoImg()));
            }
            return toDto(rOrganizacion.save(organizacion));
        });
    }

    public void delete(Long id) {
        rOrganizacion.deleteById(id);
    }

    public boolean existsById(Long id) {
        return rOrganizacion.existsById(id);
    }

    public boolean existsByNombre(String nombre) {
        return rOrganizacion.existsByNombre(nombre);
    }

    public Optional<Organizacion> getByNombre(String nombre) {
        return rOrganizacion.findByNombre(nombre);
    }

    public Optional<Organizacion> getEntity(Long id) {
        return rOrganizacion.findById(id);
    }

    public dtoOrganizacion toDto(Organizacion organizacion) {
        dtoOrganizacion dto = new dtoOrganizacion();
        dto.setId(organizacion.getId());
        dto.setNombre(organizacion.getNombre());
        dto.setUbicacion(organizacion.getUbicacion());
        dto.setUrlWeb(organizacion.getUrlWeb());
        dto.setLogoImg(encodeLogo(organizacion.getLogoImg()));
        return dto;
    }

    private byte[] decodeLogo(String base64) {
        if (StringUtils.isBlank(base64)) {
            return null;
        }
        String data = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
        return Base64.getDecoder().decode(data.trim());
    }

    private String encodeLogo(byte[] logo) {
        if (logo == null || logo.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(logo);
    }
}
