
package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;


public class dtoBanner {
    @NotBlank
    private String titulo; 
    @NotBlank
    private String img; 

    
    //constructores
    public dtoBanner() {
    }

    public dtoBanner(String titulo, String img) {
        this.titulo = titulo;
        this.img = img;
    }

    //getters y setters
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }
  
    
   
}
