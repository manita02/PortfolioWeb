package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoOrganizacion;
import com.portfolioweb.aj.Entidad.Organizacion;
import com.portfolioweb.aj.Repositorio.ROrganizacion;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
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

    private static final String DEFAULT_LOGO_RESOURCE = "organizaction-default.png";

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
                resolveLogoForSave(dto.getLogoImg())
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
        dto.setLogoImg(encodeLogo(resolveLogoForRead(organizacion.getLogoImg())));
        return dto;
    }

    private byte[] resolveLogoForSave(String base64) {
        if (StringUtils.isNotBlank(base64)) {
            return decodeLogo(base64);
        }
        return loadDefaultLogo();
    }

    private byte[] resolveLogoForRead(byte[] logo) {
        if (logo != null && logo.length > 0) {
            return logo;
        }
        return loadDefaultLogo();
    }

    private byte[] loadDefaultLogo() {
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(DEFAULT_LOGO_RESOURCE)) {
            if (inputStream == null) {
                throw new IllegalStateException("No se encontro la imagen por defecto: " + DEFAULT_LOGO_RESOURCE);
            }
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] chunk = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(chunk)) != -1) {
                buffer.write(chunk, 0, bytesRead);
            }
            return buffer.toByteArray();
        } catch (IOException exception) {
            throw new IllegalStateException("Error al cargar la imagen por defecto", exception);
        }
    }

    private byte[] decodeLogo(String base64) {
        String data = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
        return Base64.getDecoder().decode(data.trim());
    }

    private String encodeLogo(byte[] logo) {
        return Base64.getEncoder().encodeToString(logo);
    }
}
