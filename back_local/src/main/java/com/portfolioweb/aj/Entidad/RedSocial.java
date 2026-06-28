
package com.portfolioweb.aj.Entidad;

import com.portfolioweb.aj.Validacion.FileCategory;
import com.portfolioweb.aj.Validacion.ValidFile;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;

@Entity
public class RedSocial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_red")
    private int id;
    private String nombreRedS;

    @Lob
    @ValidFile(FileCategory.IMAGE)
    @Column(name = "img", nullable = false)
    private byte[] img;

    @Column(length = 2048)
    private String link;

    public RedSocial() {
    }

    public RedSocial(String nombreRedS, byte[] img, String link) {
        this.nombreRedS = nombreRedS;
        this.img = img;
        this.link = link;
    }

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

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

}
