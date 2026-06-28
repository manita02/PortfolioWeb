package com.portfolioweb.aj.Util;

import com.portfolioweb.aj.Validacion.FileCategory;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import org.apache.commons.lang3.StringUtils;

public final class ArchivoUtil {

    public static final long MAX_IMAGE_BYTES = 2L * 1024 * 1024;
    public static final long MAX_PDF_BYTES = 5L * 1024 * 1024;

    private static final Set<String> IMAGE_MIME_TYPES = new HashSet<>(Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png"
    ));

    private static final Set<String> PDF_MIME_TYPES = new HashSet<>(Arrays.asList(
            "application/pdf"
    ));

    private ArchivoUtil() {
    }

    public static Optional<String> validarImagenBase64(String base64) {
        return validarBase64(base64, FileCategory.IMAGE);
    }

    public static Optional<String> validarPdfBase64(String base64) {
        return validarBase64(base64, FileCategory.PDF);
    }

    public static Optional<String> validarBase64(String base64, FileCategory category) {
        if (StringUtils.isBlank(base64)) {
            return Optional.empty();
        }
        return validarBytes(decodificarBase64(base64), category, extraerMimeDeDataUri(base64));
    }

    public static Optional<String> validarBytes(byte[] data, FileCategory category) {
        return validarBytes(data, category, null);
    }

    public static Optional<String> validarBytes(byte[] data, FileCategory category, String declaredMime) {
        if (data == null || data.length == 0) {
            return Optional.empty();
        }

        long maxBytes = category == FileCategory.IMAGE ? MAX_IMAGE_BYTES : MAX_PDF_BYTES;
        if (data.length > maxBytes) {
            String limite = category == FileCategory.IMAGE ? "2MB" : "5MB";
            return Optional.of("El archivo supera el limite de " + limite);
        }

        String detectedMime = detectarMimeType(data);
        if (detectedMime == null) {
            return Optional.of("Tipo de archivo no permitido");
        }

        Set<String> allowedMimeTypes = category == FileCategory.IMAGE ? IMAGE_MIME_TYPES : PDF_MIME_TYPES;
        if (!allowedMimeTypes.contains(detectedMime)) {
            return Optional.of("Tipo de archivo no permitido. Se esperaba "
                    + (category == FileCategory.IMAGE ? "JPEG o PNG" : "PDF"));
        }

        if (StringUtils.isNotBlank(declaredMime) && !mimeTypesCoinciden(declaredMime, detectedMime)) {
            return Optional.of("El tipo declarado no coincide con el contenido del archivo");
        }

        return Optional.empty();
    }

    public static byte[] decodificarBase64(String base64) {
        if (StringUtils.isBlank(base64)) {
            return null;
        }
        String data = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
        return Base64.getDecoder().decode(data.trim());
    }

    public static String codificarBase64(byte[] data) {
        if (data == null || data.length == 0) {
            return null;
        }
        return Base64.getEncoder().encodeToString(data);
    }

    public static ResultadoArchivo procesarImagen(String base64) {
        return procesar(base64, FileCategory.IMAGE);
    }

    public static ResultadoArchivo procesarPdf(String base64) {
        return procesar(base64, FileCategory.PDF);
    }

    private static ResultadoArchivo procesar(String base64, FileCategory category) {
        if (StringUtils.isBlank(base64)) {
            return ResultadoArchivo.sinArchivo();
        }

        String declaredMime = extraerMimeDeDataUri(base64);
        byte[] bytes = decodificarBase64(base64);
        Optional<String> error = validarBytes(bytes, category, declaredMime);
        if (error.isPresent()) {
            return ResultadoArchivo.conError(error.get());
        }
        return ResultadoArchivo.conArchivo(bytes);
    }

    private static String extraerMimeDeDataUri(String base64) {
        if (StringUtils.isBlank(base64) || !base64.startsWith("data:") || !base64.contains(",")) {
            return null;
        }
        String header = base64.substring(5, base64.indexOf(","));
        int semicolonIndex = header.indexOf(';');
        return semicolonIndex >= 0 ? header.substring(0, semicolonIndex).trim().toLowerCase() : header.trim().toLowerCase();
    }

    private static boolean mimeTypesCoinciden(String declaredMime, String detectedMime) {
        String normalizedDeclared = declaredMime.trim().toLowerCase();
        if (normalizedDeclared.equals(detectedMime)) {
            return true;
        }
        return normalizedDeclared.equals("image/jpg") && detectedMime.equals("image/jpeg");
    }

    private static String detectarMimeType(byte[] data) {
        if (data.length >= 3 && (data[0] & 0xFF) == 0xFF && (data[1] & 0xFF) == 0xD8 && (data[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }
        if (data.length >= 8
                && data[0] == (byte) 0x89
                && data[1] == 0x50
                && data[2] == 0x4E
                && data[3] == 0x47
                && data[4] == 0x0D
                && data[5] == 0x0A
                && data[6] == 0x1A
                && data[7] == 0x0A) {
            return "image/png";
        }
        if (data.length >= 4
                && data[0] == 0x25
                && data[1] == 0x50
                && data[2] == 0x44
                && data[3] == 0x46) {
            return "application/pdf";
        }
        return null;
    }

    public static final class ResultadoArchivo {

        private final byte[] bytes;
        private final String mensajeError;

        private ResultadoArchivo(byte[] bytes, String mensajeError) {
            this.bytes = bytes;
            this.mensajeError = mensajeError;
        }

        public static ResultadoArchivo sinArchivo() {
            return new ResultadoArchivo(null, null);
        }

        public static ResultadoArchivo conArchivo(byte[] bytes) {
            return new ResultadoArchivo(bytes, null);
        }

        public static ResultadoArchivo conError(String mensajeError) {
            return new ResultadoArchivo(null, mensajeError);
        }

        public boolean tieneError() {
            return mensajeError != null;
        }

        public byte[] getBytes() {
            return bytes;
        }

        public String getMensajeError() {
            return mensajeError;
        }
    }
}
