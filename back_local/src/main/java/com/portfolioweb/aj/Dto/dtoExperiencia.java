package com.portfolioweb.aj.Dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotBlank;

public class dtoExperiencia {

    private int id;

    @NotBlank
    private String nombreE;

    @NotBlank
    private String descripcionE;

    private boolean esActual;

    @NotBlank
    private String fechaInicio;

    private String fechaFin;

    private Long tipoEmpleoId;

    private Long tipoUbicacionId;

    private Long organizacionId;

    private List<Integer> habilidadesIds = new ArrayList<>();

    private dtoTipoEmpleo tipoEmpleo;

    private dtoTipoUbicacion tipoUbicacion;

    private dtoOrganizacion organizacion;

    private List<dtoHabilidades> habilidades = new ArrayList<>();

    public dtoExperiencia() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreE() {
        return nombreE;
    }

    public void setNombreE(String nombreE) {
        this.nombreE = nombreE;
    }

    public String getDescripcionE() {
        return descripcionE;
    }

    public void setDescripcionE(String descripcionE) {
        this.descripcionE = descripcionE;
    }

    public boolean isEsActual() {
        return esActual;
    }

    public void setEsActual(boolean esActual) {
        this.esActual = esActual;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Long getTipoEmpleoId() {
        return tipoEmpleoId;
    }

    public void setTipoEmpleoId(Long tipoEmpleoId) {
        this.tipoEmpleoId = tipoEmpleoId;
    }

    public Long getTipoUbicacionId() {
        return tipoUbicacionId;
    }

    public void setTipoUbicacionId(Long tipoUbicacionId) {
        this.tipoUbicacionId = tipoUbicacionId;
    }

    public Long getOrganizacionId() {
        return organizacionId;
    }

    public void setOrganizacionId(Long organizacionId) {
        this.organizacionId = organizacionId;
    }

    public List<Integer> getHabilidadesIds() {
        return habilidadesIds;
    }

    public void setHabilidadesIds(List<Integer> habilidadesIds) {
        this.habilidadesIds = habilidadesIds;
    }

    public dtoTipoEmpleo getTipoEmpleo() {
        return tipoEmpleo;
    }

    public void setTipoEmpleo(dtoTipoEmpleo tipoEmpleo) {
        this.tipoEmpleo = tipoEmpleo;
    }

    public dtoTipoUbicacion getTipoUbicacion() {
        return tipoUbicacion;
    }

    public void setTipoUbicacion(dtoTipoUbicacion tipoUbicacion) {
        this.tipoUbicacion = tipoUbicacion;
    }

    public dtoOrganizacion getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(dtoOrganizacion organizacion) {
        this.organizacion = organizacion;
    }

    public List<dtoHabilidades> getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(List<dtoHabilidades> habilidades) {
        this.habilidades = habilidades;
    }
}
