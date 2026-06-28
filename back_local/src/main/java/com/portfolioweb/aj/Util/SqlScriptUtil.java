package com.portfolioweb.aj.Util;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.sql.Types;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public final class SqlScriptUtil {

    private SqlScriptUtil() {
    }

    public static boolean isValidTableName(String tableName) {
        return tableName != null && tableName.matches("[a-zA-Z0-9_]+");
    }

    public static String quoteIdentifier(String identifier) {
        return "`" + identifier.replace("`", "``") + "`";
    }

    public static String escapeString(String value) {
        if (value == null) {
            return null;
        }
        return value.replace("\\", "\\\\").replace("'", "''");
    }

    public static String formatSqlValue(Object value, int sqlType) throws SQLException {
        if (value == null) {
            return "NULL";
        }

        if (value instanceof byte[]) {
            return "0x" + bytesToHex((byte[]) value);
        }

        if (value instanceof Boolean) {
            return Boolean.TRUE.equals(value) ? "1" : "0";
        }

        if (value instanceof Number) {
            return value.toString();
        }

        if (value instanceof Date) {
            return "'" + new Timestamp(((Date) value).getTime()).toString() + "'";
        }

        if (sqlType == Types.BIT || sqlType == Types.BOOLEAN) {
            return value.toString();
        }

        return "'" + escapeString(value.toString()) + "'";
    }

    public static String buildInsertStatement(ResultSet resultSet, String tableName) throws SQLException {
        ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();

        if (!isValidTableName(tableName)) {
            throw new SQLException("Nombre de tabla no valido: " + tableName);
        }

        List<String> columnNames = new ArrayList<String>();
        List<String> values = new ArrayList<String>();

        for (int i = 1; i <= columnCount; i++) {
            columnNames.add(quoteIdentifier(metaData.getColumnName(i)));
            values.add(formatSqlValue(resultSet.getObject(i), metaData.getColumnType(i)));
        }

        StringBuilder insert = new StringBuilder();
        insert.append("INSERT INTO ").append(quoteIdentifier(tableName)).append(" (");
        insert.append(join(columnNames, ", "));
        insert.append(") VALUES (");
        insert.append(join(values, ", "));
        insert.append(");");
        return insert.toString();
    }

    private static String join(List<String> items, String separator) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i < items.size(); i++) {
            if (i > 0) {
                builder.append(separator);
            }
            builder.append(items.get(i));
        }
        return builder.toString();
    }

    private static String bytesToHex(byte[] bytes) {
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (int i = 0; i < bytes.length; i++) {
            hex.append(String.format("%02x", bytes[i]));
        }
        return hex.toString();
    }
}
