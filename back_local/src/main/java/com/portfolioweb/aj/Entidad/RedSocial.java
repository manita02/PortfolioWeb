
package com.portfolioweb.aj.Entidad;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class RedSocial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_red")
    private int id; 
    private String nombreRedS;
    private String img;
    private String link; 
    
    //constructores
    public RedSocial() {
    }

    public RedSocial(String nombreRedS, String img, String link) {
        this.nombreRedS = nombreRedS;
        this.img = img;
        this.link = link;
    }

    //getters y setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

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
