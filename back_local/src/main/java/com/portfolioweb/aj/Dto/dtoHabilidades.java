
package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;


public class dtoHabilidades {
    @NotBlank
    private String nombreH; 
    @NotBlank
    private int porcentaje;
    @NotBlank
    private String img;

    
    //constructores
    public dtoHabilidades() {
    }

    public dtoHabilidades(String nombreH, int porcentaje, String img) {
        this.nombreH = nombreH;
        this.porcentaje = porcentaje;
        this.img = img; 
    }

    //getters y setters
    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }


    public String getNombreH() {
        return nombreH;
    }

    public void setNombreH(String nombreH) {
        this.nombreH = nombreH;
    }

    public int getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(int porcentaje) {
        this.porcentaje = porcentaje;
    }
    
    
}
