package com.portfolioweb.aj.Excepcion;

import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class ManejadorExcepcionesArchivo {

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
}
