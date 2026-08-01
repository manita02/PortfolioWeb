package com.portfolioweb.aj.Excepcion;

import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class ManejadorExcepcionesArchivo {

    private static final String MENSAJE_MAX_ALLOWED_PACKET =
            "Imagen demasiado pesada para MySQL. Usá menos de 750 KB o aumentá max_allowed_packet.";

    @ExceptionHandler(ArchivoInvalidoException.class)
    public ResponseEntity<Mensaje> manejarArchivoInvalido(ArchivoInvalidoException exception) {
        return new ResponseEntity<>(new Mensaje(exception.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Mensaje> manejarTamanoMultipart(MaxUploadSizeExceededException exception) {
        return new ResponseEntity<>(
                new Mensaje("Archivo demasiado grande (máx. 5 MB)."),
                HttpStatus.PAYLOAD_TOO_LARGE
        );
    }

    @ExceptionHandler(BackupSqlException.class)
    public ResponseEntity<Mensaje> manejarBackupSql(BackupSqlException exception) {
        String mensaje = exception.getMessage();
        if (exception.getCause() != null && exception.getCause().getMessage() != null
                && !mensaje.contains(exception.getCause().getMessage())) {
            mensaje = mensaje + " (" + exception.getCause().getMessage() + ")";
        }
        return new ResponseEntity<>(new Mensaje(mensaje), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(JpaSystemException.class)
    public ResponseEntity<Mensaje> manejarJpa(JpaSystemException exception) throws JpaSystemException {
        if (esPaqueteMysqlDemasiadoGrande(exception)) {
            return new ResponseEntity<>(new Mensaje(MENSAJE_MAX_ALLOWED_PACKET), HttpStatus.BAD_REQUEST);
        }
        throw exception;
    }

    private boolean esPaqueteMysqlDemasiadoGrande(Throwable exception) {
        Throwable actual = exception;
        while (actual != null) {
            String nombre = actual.getClass().getSimpleName();
            String mensaje = actual.getMessage();
            if ("PacketTooBigException".equals(nombre)) {
                return true;
            }
            if (mensaje != null && mensaje.contains("max_allowed_packet")) {
                return true;
            }
            actual = actual.getCause();
        }
        return false;
    }
}
