package com.portfolioweb.aj.Servicio;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.portfolioweb.aj.Dto.PortfolioSnapshot;
import com.portfolioweb.aj.Dto.StaticExportResult;
import com.portfolioweb.aj.Dto.dtoBanner;
import com.portfolioweb.aj.Dto.dtoEducacion;
import com.portfolioweb.aj.Dto.dtoExperiencia;
import com.portfolioweb.aj.Dto.dtoHabilidad;
import com.portfolioweb.aj.Dto.dtoOrganizacion;
import com.portfolioweb.aj.Dto.dtoPersona;
import com.portfolioweb.aj.Dto.dtoProyecto;
import com.portfolioweb.aj.Dto.dtoRedSocial;
import com.portfolioweb.aj.Dto.dtoTipoEducacion;
import com.portfolioweb.aj.Dto.dtoTipoEmpleo;
import com.portfolioweb.aj.Dto.dtoTipoHabilidad;
import com.portfolioweb.aj.Dto.dtoTipoUbicacion;
import com.portfolioweb.aj.Entidad.TipoEducacion;
import com.portfolioweb.aj.Entidad.TipoEmpleo;
import com.portfolioweb.aj.Entidad.TipoHabilidad;
import com.portfolioweb.aj.Entidad.TipoUbicacion;
import com.portfolioweb.aj.Excepcion.BackupSqlException;
import com.portfolioweb.aj.Util.ArchivoUtil;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SStaticExport {

    private static final String MEDIA_PREFIX = "assets/media/";

    @Value("${static.export.output-dir:../front_local/src/assets}")
    private String outputDir;

    @Autowired
    private SBanner sBanner;

    @Autowired
    private ImpPersonaServicio impPersonaServicio;

    @Autowired
    private SEducacion sEducacion;

    @Autowired
    private SExperiencia sExperiencia;

    @Autowired
    private SProyecto sProyecto;

    @Autowired
    private SHabilidad sHabilidad;

    @Autowired
    private SRedSocial sRedSocial;

    @Autowired
    private SOrganizacion sOrganizacion;

    @Autowired
    private STipoHabilidad sTipoHabilidad;

    @Autowired
    private STipoEducacion sTipoEducacion;

    @Autowired
    private STipoEmpleo sTipoEmpleo;

    @Autowired
    private STipoUbicacion sTipoUbicacion;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .enable(SerializationFeature.INDENT_OUTPUT);

    public StaticExportResult exportar() {
        Path assetsRoot = Paths.get(outputDir).toAbsolutePath().normalize();
        Path dataDir = assetsRoot.resolve("data");
        Path mediaDir = assetsRoot.resolve("media");

        try {
            limpiarDirectorio(mediaDir);
            Files.createDirectories(dataDir);
            Files.createDirectories(mediaDir);

            StaticMediaWriter mediaWriter = new StaticMediaWriter(mediaDir);

            PortfolioSnapshot snapshot = new PortfolioSnapshot();
            snapshot.setExportedAt(new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss").format(new Date()));
            snapshot.setBanner(procesarBanners(mediaWriter));
            snapshot.setPersona(procesarPersonas(mediaWriter));
            snapshot.setOrganizacion(procesarOrganizaciones(mediaWriter));
            snapshot.setHabilidades(procesarHabilidades(mediaWriter));
            snapshot.setRedesSociales(procesarRedesSociales(mediaWriter));
            snapshot.setEducacion(procesarEducacion(mediaWriter));
            snapshot.setExperiencia(procesarExperiencia(mediaWriter));
            snapshot.setProyecto(procesarProyectos(mediaWriter));
            snapshot.setTipoHabilidad(mapTiposHabilidad(sTipoHabilidad.list()));
            snapshot.setTipoEducacion(mapTiposEducacion(sTipoEducacion.list()));
            snapshot.setTipoEmpleo(mapTiposEmpleo(sTipoEmpleo.list()));
            snapshot.setTipoUbicacion(mapTiposUbicacion(sTipoUbicacion.list()));

            Path jsonPath = dataDir.resolve("portfolio.json");
            objectMapper.writeValue(jsonPath.toFile(), snapshot);

            return new StaticExportResult(
                    snapshot.getExportedAt(),
                    assetsRoot.toString(),
                    mediaWriter.getFilesWritten(),
                    "Exportacion estatica generada en " + jsonPath
            );
        } catch (IOException exception) {
            throw new BackupSqlException(
                    "No se pudo generar la exportacion estatica: " + exception.getMessage(),
                    exception
            );
        } catch (RuntimeException exception) {
            if (exception instanceof BackupSqlException) {
                throw exception;
            }
            throw new BackupSqlException(
                    "No se pudo generar la exportacion estatica: " + exception.getMessage(),
                    exception
            );
        }
    }

    private List<dtoBanner> procesarBanners(StaticMediaWriter mediaWriter) {
        List<dtoBanner> banners = new ArrayList<>();
        for (dtoBanner dto : sBanner.list()) {
            dto.setImg(mediaWriter.exportImage(dto.getImg(), "banner/" + dto.getId()));
            banners.add(dto);
        }
        return banners;
    }

    private List<dtoPersona> procesarPersonas(StaticMediaWriter mediaWriter) {
        List<dtoPersona> personas = new ArrayList<>();
        for (dtoPersona dto : impPersonaServicio.list()) {
            dto.setImg(mediaWriter.exportImage(dto.getImg(), "persona/" + dto.getId()));
            personas.add(dto);
        }
        return personas;
    }

    private List<dtoOrganizacion> procesarOrganizaciones(StaticMediaWriter mediaWriter) {
        List<dtoOrganizacion> organizaciones = new ArrayList<>();
        for (dtoOrganizacion dto : sOrganizacion.list()) {
            organizaciones.add(procesarOrganizacion(dto, mediaWriter));
        }
        return organizaciones;
    }

    private dtoOrganizacion procesarOrganizacion(dtoOrganizacion dto, StaticMediaWriter mediaWriter) {
        if (dto == null) {
            return null;
        }
        dto.setLogoImg(mediaWriter.exportImage(dto.getLogoImg(), "organizacion/" + dto.getId() + "/logo"));
        return dto;
    }

    private List<dtoHabilidad> procesarHabilidades(StaticMediaWriter mediaWriter) {
        List<dtoHabilidad> habilidades = new ArrayList<>();
        for (dtoHabilidad dto : sHabilidad.list()) {
            habilidades.add(procesarHabilidad(dto, mediaWriter));
        }
        return habilidades;
    }

    private dtoHabilidad procesarHabilidad(dtoHabilidad dto, StaticMediaWriter mediaWriter) {
        if (dto == null) {
            return null;
        }
        dto.setImg(mediaWriter.exportImage(dto.getImg(), "habilidad/" + dto.getId()));
        return dto;
    }

    private List<dtoRedSocial> procesarRedesSociales(StaticMediaWriter mediaWriter) {
        List<dtoRedSocial> redes = new ArrayList<>();
        for (dtoRedSocial dto : sRedSocial.list()) {
            dto.setImg(mediaWriter.exportImage(dto.getImg(), "red-social/" + dto.getId()));
            redes.add(dto);
        }
        return redes;
    }

    private List<dtoEducacion> procesarEducacion(StaticMediaWriter mediaWriter) {
        List<dtoEducacion> items = new ArrayList<>();
        for (dtoEducacion dto : sEducacion.list()) {
            dto.setArchivoImagen(mediaWriter.exportImage(
                    dto.getArchivoImagen(),
                    "educacion/" + dto.getId() + "/imagen"
            ));
            dto.setArchivoPdf(mediaWriter.exportPdf(
                    dto.getArchivoPdf(),
                    "educacion/" + dto.getId() + "/certificado"
            ));
            dto.setOrganizacion(procesarOrganizacion(dto.getOrganizacion(), mediaWriter));
            if (dto.getHabilidades() != null) {
                dto.setHabilidades(dto.getHabilidades().stream()
                        .map(h -> procesarHabilidad(h, mediaWriter))
                        .collect(Collectors.toList()));
            }
            items.add(dto);
        }
        return items;
    }

    private List<dtoExperiencia> procesarExperiencia(StaticMediaWriter mediaWriter) {
        List<dtoExperiencia> items = new ArrayList<>();
        for (dtoExperiencia dto : sExperiencia.list()) {
            dto.setOrganizacion(procesarOrganizacion(dto.getOrganizacion(), mediaWriter));
            if (dto.getHabilidades() != null) {
                dto.setHabilidades(dto.getHabilidades().stream()
                        .map(h -> procesarHabilidad(h, mediaWriter))
                        .collect(Collectors.toList()));
            }
            items.add(dto);
        }
        return items;
    }

    private List<dtoProyecto> procesarProyectos(StaticMediaWriter mediaWriter) {
        List<dtoProyecto> items = new ArrayList<>();
        for (dtoProyecto dto : sProyecto.list()) {
            dto.setImagen(mediaWriter.exportImage(dto.getImagen(), "proyecto/" + dto.getId()));
            dto.setOrganizacion(procesarOrganizacion(dto.getOrganizacion(), mediaWriter));
            if (dto.getHabilidades() != null) {
                dto.setHabilidades(dto.getHabilidades().stream()
                        .map(h -> procesarHabilidad(h, mediaWriter))
                        .collect(Collectors.toList()));
            }
            items.add(dto);
        }
        return items;
    }

    private List<dtoTipoHabilidad> mapTiposHabilidad(List<TipoHabilidad> tipos) {
        List<dtoTipoHabilidad> mapped = new ArrayList<>();
        for (TipoHabilidad tipo : tipos) {
            mapped.add(new dtoTipoHabilidad(tipo.getId(), tipo.getNombre()));
        }
        return mapped;
    }

    private List<dtoTipoEducacion> mapTiposEducacion(List<TipoEducacion> tipos) {
        List<dtoTipoEducacion> mapped = new ArrayList<>();
        for (TipoEducacion tipo : tipos) {
            mapped.add(new dtoTipoEducacion(tipo.getId(), tipo.getNombre()));
        }
        return mapped;
    }

    private List<dtoTipoEmpleo> mapTiposEmpleo(List<TipoEmpleo> tipos) {
        List<dtoTipoEmpleo> mapped = new ArrayList<>();
        for (TipoEmpleo tipo : tipos) {
            mapped.add(new dtoTipoEmpleo(tipo.getId(), tipo.getNombre()));
        }
        return mapped;
    }

    private List<dtoTipoUbicacion> mapTiposUbicacion(List<TipoUbicacion> tipos) {
        List<dtoTipoUbicacion> mapped = new ArrayList<>();
        for (TipoUbicacion tipo : tipos) {
            mapped.add(new dtoTipoUbicacion(tipo.getId(), tipo.getNombre()));
        }
        return mapped;
    }

    private void limpiarDirectorio(Path directory) throws IOException {
        if (!Files.exists(directory)) {
            return;
        }
        try (Stream<Path> paths = Files.walk(directory)) {
            List<Path> entries = paths
                    .sorted((a, b) -> b.getNameCount() - a.getNameCount())
                    .collect(Collectors.toList());
            for (Path path : entries) {
                if (path.equals(directory)) {
                    continue;
                }
                Files.deleteIfExists(path);
            }
        }
    }

    private final class StaticMediaWriter {

        private final Path mediaRoot;
        private final Map<String, String> cache = new HashMap<>();
        private int filesWritten;

        private StaticMediaWriter(Path mediaRoot) {
            this.mediaRoot = mediaRoot;
        }

        private int getFilesWritten() {
            return filesWritten;
        }

        private String exportImage(String value, String relativePathWithoutExt) {
            return exportBinary(value, relativePathWithoutExt, true);
        }

        private String exportPdf(String value, String relativePathWithoutExt) {
            return exportBinary(value, relativePathWithoutExt, false);
        }

        private String exportBinary(String value, String relativePathWithoutExt, boolean imageOnly) {
            if (StringUtils.isBlank(value)) {
                return value;
            }
            String trimmed = value.trim();
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith(MEDIA_PREFIX)) {
                return trimmed;
            }

            if (cache.containsKey(relativePathWithoutExt)) {
                return cache.get(relativePathWithoutExt);
            }

            byte[] bytes = ArchivoUtil.decodificarBase64(trimmed);
            if (bytes == null || bytes.length == 0) {
                return null;
            }

            String extension = ArchivoUtil.extensionParaBytes(bytes);
            if (extension == null) {
                return null;
            }
            if (imageOnly && ".pdf".equals(extension)) {
                return null;
            }
            if (!imageOnly && !".pdf".equals(extension)) {
                return null;
            }

            try {
                Path target = mediaRoot.resolve(relativePathWithoutExt + extension);
                Files.createDirectories(target.getParent());
                Files.write(target, bytes);
                filesWritten++;
                String publicPath = MEDIA_PREFIX + relativePathWithoutExt.replace('\\', '/') + extension;
                cache.put(relativePathWithoutExt, publicPath);
                return publicPath;
            } catch (IOException exception) {
                throw new BackupSqlException(
                        "No se pudo escribir el archivo de media: " + relativePathWithoutExt,
                        exception
                );
            }
        }
    }
}
