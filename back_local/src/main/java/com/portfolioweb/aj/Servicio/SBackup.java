package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Excepcion.ArchivoInvalidoException;
import com.portfolioweb.aj.Excepcion.BackupSqlException;
import com.portfolioweb.aj.Util.SqlScriptUtil;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.sql.DataSource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptException;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SBackup {

    private static final String HEADER =
            "-- Backup generado por PortfolioWeb\n"
                    + "-- Compatible con el endpoint POST /api/backup/upload\n";

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    public byte[] generarScriptSql() {
        StringBuilder script = new StringBuilder();
        script.append(HEADER);
        script.append("-- Fecha: ").append(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date())).append("\n\n");
        script.append("SET FOREIGN_KEY_CHECKS=0;\n\n");

        List<String> tablas = obtenerTablasAplicacion();
        for (String tabla : tablas) {
            script.append("-- Tabla: ").append(tabla).append("\n");
            script.append(generarInsertsTabla(tabla));
            script.append("\n");
        }

        script.append("SET FOREIGN_KEY_CHECKS=1;\n");
        return script.toString().getBytes(StandardCharsets.UTF_8);
    }

    public void restaurarDesdeArchivo(MultipartFile archivo) {
        validarArchivoSql(archivo);

        try {
            byte[] contenido = archivo.getBytes();
            if (contenido.length == 0) {
                throw new ArchivoInvalidoException("El archivo SQL esta vacio");
            }

            EncodedResource script = new EncodedResource(
                    new ByteArrayResource(contenido),
                    StandardCharsets.UTF_8.name()
            );

            try (Connection connection = dataSource.getConnection()) {
                ScriptUtils.executeSqlScript(connection, script);
            }
        } catch (IOException exception) {
            throw new ArchivoInvalidoException("No se pudo leer el archivo SQL: " + exception.getMessage());
        } catch (ScriptException exception) {
            throw new BackupSqlException(
                    "Error al ejecutar el script SQL. Verifique que el archivo no este corrupto y que las sentencias sean validas.",
                    exception
            );
        } catch (SQLException exception) {
            throw new BackupSqlException("No se pudo conectar con la base de datos para ejecutar el script", exception);
        }
    }

    public String generarNombreArchivoDescarga() {
        return "backup_portfolio_" + new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + ".sql";
    }

    private void validarArchivoSql(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) {
            throw new ArchivoInvalidoException("Debe enviar un archivo SQL");
        }

        String nombreArchivo = archivo.getOriginalFilename();
        if (StringUtils.isBlank(nombreArchivo) || !nombreArchivo.toLowerCase().endsWith(".sql")) {
            throw new ArchivoInvalidoException("Solo se permiten archivos con extension .sql");
        }
    }

    private List<String> obtenerTablasAplicacion() {
        List<String> tablas = jdbcTemplate.query(
                "SELECT TABLE_NAME FROM information_schema.TABLES "
                        + "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_TYPE = 'BASE TABLE' "
                        + "ORDER BY TABLE_NAME",
                (ResultSet resultSet, int rowNum) -> resultSet.getString("TABLE_NAME")
        );

        List<String> tablasValidas = new ArrayList<String>();
        for (String tabla : tablas) {
            if (SqlScriptUtil.isValidTableName(tabla)) {
                tablasValidas.add(tabla);
            }
        }
        return tablasValidas;
    }

    private String generarInsertsTabla(String tabla) {
        if (!SqlScriptUtil.isValidTableName(tabla)) {
            throw new BackupSqlException("Nombre de tabla no valido: " + tabla);
        }

        final StringBuilder inserts = new StringBuilder();
        final String sql = "SELECT * FROM " + SqlScriptUtil.quoteIdentifier(tabla);

        try {
            jdbcTemplate.query(sql, resultSet -> {
                try {
                    inserts.append(SqlScriptUtil.buildInsertStatement(resultSet, tabla)).append("\n");
                } catch (SQLException exception) {
                    throw new BackupSqlException(
                            "Error al generar INSERT para la tabla " + tabla,
                            exception
                    );
                }
            });
        } catch (BackupSqlException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new BackupSqlException("Error al leer datos de la tabla " + tabla, exception);
        }

        if (inserts.length() == 0) {
            inserts.append("-- Sin registros\n");
        }

        return inserts.toString();
    }
}
