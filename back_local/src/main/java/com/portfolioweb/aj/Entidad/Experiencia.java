package com.portfolioweb.aj.Entidad;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Experiencia {

     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_experiencia")
    private int id;
    private String nombreE;
    private String descripcionE;
    private String img;
    private int anocomienzo;
   
  

    //Constructores
    public Experiencia() {
    }

    public Experiencia(String nombreE, String descripcionE, String img, int anocomienzo) {
        this.nombreE = nombreE;
        this.descripcionE = descripcionE;
        this.img = img;
        this.anocomienzo = anocomienzo;
    }

    //Getters and Setters
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
