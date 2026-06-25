package com.portfolioweb.aj.Util;

import java.time.YearMonth;
import java.util.Comparator;
import org.apache.commons.lang3.StringUtils;

public final class OrdenFechaUtil {

    private OrdenFechaUtil() {
    }

    public static int compareMesAnioDesc(String fechaA, String fechaB) {
        YearMonth yearMonthA = parseMesAnio(fechaA);
        YearMonth yearMonthB = parseMesAnio(fechaB);

        if (yearMonthA == null && yearMonthB == null) {
            return 0;
        }
        if (yearMonthA == null) {
            return 1;
        }
        if (yearMonthB == null) {
            return -1;
        }
        return yearMonthB.compareTo(yearMonthA);
    }

    public static Comparator<String> mesAnioDesc() {
        return OrdenFechaUtil::compareMesAnioDesc;
    }

    public static YearMonth parseMesAnio(String fecha) {
        if (StringUtils.isBlank(fecha)) {
            return null;
        }
        String[] parts = fecha.trim().split("/");
        if (parts.length != 2) {
            return null;
        }
        try {
            int month = Integer.parseInt(parts[0]);
            int year = Integer.parseInt(parts[1]);
            return YearMonth.of(year, month);
        } catch (RuntimeException ex) {
            return null;
        }
    }
}
