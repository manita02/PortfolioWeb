
package com.portfolioweb.aj.Entidad;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity 
public class Educacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_educacion")
    private int id; 
    private String nombreE; 
    private String descripcionE;
    private String img;
    private int anocomienzo;
    
    
    //constructores
    public Educacion() {
    }

    public Educacion(String nombreE, String descripcionE, String img, int anocomienzo) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.img = img;
        this.anocomienzo = anocomienzo;     
    
    }
    
    //getters y setters
    public String getImg() {    
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public int getAnocomienzo() {
        return anocomienzo;
    }

    
    public void setAnocomienzo(int anocomienzo) {
        this.anocomienzo = anocomienzo;
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
    
    
    
    
}
