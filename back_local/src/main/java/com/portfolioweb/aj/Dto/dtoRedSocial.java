
package com.portfolioweb.aj.Dto;

import javax.validation.constraints.NotBlank;


public class dtoRedSocial {
    @NotBlank
    private String nombreRedS;
    @NotBlank
    private String img;
    @NotBlank
    private String link; 

    //constructores
    public dtoRedSocial() {
    }

    public dtoRedSocial(String nombreRedS, String img, String link) {
        this.nombreRedS = nombreRedS;
        this.img = img;
        this.link = link;
    }

    //getters y setters
    public String getNombreRedS() {
        return nombreRedS;
    }

    public void setNombreRedS(String nombreRedS) {
        this.nombreRedS = nombreRedS;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
    
    
    
    
}
