package com.portfolioweb.aj.Dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotBlank;

public class dtoEducacion {

    private int id;

    @NotBlank
    private String nombreE;

    @NotBlank
    private String descripcionE;

    @NotBlank
    private String fechaInicio;

    private String fechaFin;

    private Long tipoEducacionId;

    private Long organizacionId;

    private List<Long> habilidadesIds = new ArrayList<>();

    private dtoTipoEducacion tipoEducacion;

    private dtoOrganizacion organizacion;

    private List<dtoHabilidad> habilidades = new ArrayList<>();

    private String archivoImagen;

    private String archivoPdf;

    public dtoEducacion() {
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

    public Long getTipoEducacionId() {
        return tipoEducacionId;
    }

    public void setTipoEducacionId(Long tipoEducacionId) {
        this.tipoEducacionId = tipoEducacionId;
    }

    public Long getOrganizacionId() {
        return organizacionId;
    }

    public void setOrganizacionId(Long organizacionId) {
        this.organizacionId = organizacionId;
    }

    public List<Long> getHabilidadesIds() {
        return habilidadesIds;
    }

    public void setHabilidadesIds(List<Long> habilidadesIds) {
        this.habilidadesIds = habilidadesIds;
    }

    public dtoTipoEducacion getTipoEducacion() {
        return tipoEducacion;
    }

    public void setTipoEducacion(dtoTipoEducacion tipoEducacion) {
        this.tipoEducacion = tipoEducacion;
    }

    public dtoOrganizacion getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(dtoOrganizacion organizacion) {
        this.organizacion = organizacion;
    }

    public List<dtoHabilidad> getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(List<dtoHabilidad> habilidades) {
        this.habilidades = habilidades;
    }

    public String getArchivoImagen() {
        return archivoImagen;
    }

    public void setArchivoImagen(String archivoImagen) {
        this.archivoImagen = archivoImagen;
    }

    public String getArchivoPdf() {
        return archivoPdf;
    }

    public void setArchivoPdf(String archivoPdf) {
        this.archivoPdf = archivoPdf;
    }
}
