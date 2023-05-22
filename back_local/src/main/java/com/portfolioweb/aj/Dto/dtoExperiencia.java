
package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;


public class dtoExperiencia {
    @NotBlank
    private String nombreE;
    @NotBlank
    private String descripcionE;
    @NotBlank
    private String img; 
    @NotBlank
    private int anocomienzo;
    
    
    //Constructores
    public dtoExperiencia() {
    }

    public dtoExperiencia(String nombreE, String descripcionE, String img, int anocomienzo) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.img = img;
        this.anocomienzo = anocomienzo; 
    }
    
    //getters and setters 
    public int getAnocomienzo() {
        return anocomienzo;
    }

    public void setAnocomienzo(int añocomienzo) {
        this.anocomienzo = añocomienzo;
    }
    
    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
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
    
}
