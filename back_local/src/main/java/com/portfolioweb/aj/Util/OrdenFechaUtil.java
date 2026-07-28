package com.portfolioweb.aj.Util;

import java.time.YearMonth;
import java.util.Comparator;
import java.util.function.Function;
import java.util.function.Predicate;
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

    /**
     * Orden estilo CV: actuales primero; luego por fechaFin desc; empate por fechaInicio desc.
     * Entre actuales, desempata por fechaInicio desc.
     */
    public static <T> Comparator<T> periodoCvDesc(
            Predicate<T> esActual,
            Function<T, String> fechaFin,
            Function<T, String> fechaInicio) {
        return (a, b) -> {
            boolean actualA = esActual.test(a);
            boolean actualB = esActual.test(b);
            if (actualA != actualB) {
                return actualA ? -1 : 1;
            }
            if (actualA) {
                return compareMesAnioDesc(fechaInicio.apply(a), fechaInicio.apply(b));
            }
            int byFin = compareMesAnioDesc(fechaFin.apply(a), fechaFin.apply(b));
            if (byFin != 0) {
                return byFin;
            }
            return compareMesAnioDesc(fechaInicio.apply(a), fechaInicio.apply(b));
        };
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
