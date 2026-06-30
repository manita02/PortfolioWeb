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
            "La imagen es demasiado pesada para MySQL. Elegí un JPEG o PNG de menos de 750 KB "
                    + "en tu PC (tamaño del explorador de archivos). "
                    + "Una de ~900 KB puede fallar aunque no llegue a 2 MB: al guardar, MySQL envía la imagen "
                    + "en un paquete que suele superar el límite por defecto de 1 MB en XAMPP. "
                    + "Opciones: (1) comprimir o reducir la imagen a menos de 750 KB, o (2) en phpMyAdmin ejecutar "
                    + "SET GLOBAL max_allowed_packet = 4194304;, reiniciar MySQL y el backend (entonces podés usar hasta 2 MB).";

    @ExceptionHandler(ArchivoInvalidoException.class)
    public ResponseEntity<Mensaje> manejarArchivoInvalido(ArchivoInvalidoException exception) {
        return new ResponseEntity<>(new Mensaje(exception.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Mensaje> manejarTamanoMultipart(MaxUploadSizeExceededException exception) {
        return new ResponseEntity<>(
                new Mensaje("El archivo o la peticion superan el limite permitido (5MB por archivo, 10MB total)"),
                HttpStatus.PAYLOAD_TOO_LARGE
        );
    }

    @ExceptionHandler(BackupSqlException.class)
    public ResponseEntity<Mensaje> manejarBackupSql(BackupSqlException exception) {
        return new ResponseEntity<>(new Mensaje(exception.getMessage()), HttpStatus.BAD_REQUEST);
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
