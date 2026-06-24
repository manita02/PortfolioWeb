package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;

public class dtoOrganizacion {

    private Long id;

    @NotBlank
    private String nombre;

    private String ubicacion;

    private String urlWeb;

    private String logoImg;

    public dtoOrganizacion() {
    }

    public dtoOrganizacion(String nombre, String ubicacion, String urlWeb, String logoImg) {
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.urlWeb = urlWeb;
        this.logoImg = logoImg;
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

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getUrlWeb() {
        return urlWeb;
    }

    public void setUrlWeb(String urlWeb) {
        this.urlWeb = urlWeb;
    }

    public String getLogoImg() {
        return logoImg;
    }

    public void setLogoImg(String logoImg) {
        this.logoImg = logoImg;
    }
}
