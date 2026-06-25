package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class dtoHabilidad {

    private Long id;

    @NotBlank
    private String nombre;

    private String img;

    @NotNull
    private Long tipoHabilidadId;

    private dtoTipoHabilidad tipoHabilidad;

    public dtoHabilidad() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public Long getTipoHabilidadId() {
        return tipoHabilidadId;
    }

    public void setTipoHabilidadId(Long tipoHabilidadId) {
        this.tipoHabilidadId = tipoHabilidadId;
    }

    public dtoTipoHabilidad getTipoHabilidad() {
        return tipoHabilidad;
    }

    public void setTipoHabilidad(dtoTipoHabilidad tipoHabilidad) {
        this.tipoHabilidad = tipoHabilidad;
    }
}
