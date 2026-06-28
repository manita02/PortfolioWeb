package com.portfolioweb.aj.Excepcion;

public class BackupSqlException extends RuntimeException {

    public BackupSqlException(String message) {
        super(message);
    }

    public BackupSqlException(String message, Throwable cause) {
        super(message, cause);
    }
}
