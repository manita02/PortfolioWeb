package com.portfolioweb.aj.Dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotBlank;

public class dtoProyecto {

    private int id;

    @NotBlank
    private String nombreE;

    @NotBlank
    private String descripcionE;

    @NotBlank
    private String link;

    private boolean esActual;

    @NotBlank
    private String fechaInicio;

    private String fechaFin;

    private Long organizacionId;

    private List<Integer> habilidadesIds = new ArrayList<>();

    private dtoOrganizacion organizacion;

    private List<dtoHabilidad> habilidades = new ArrayList<>();

    private String imagen;

    public dtoProyecto() {
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

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
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

    public String getImagen() {
        return imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }
}
