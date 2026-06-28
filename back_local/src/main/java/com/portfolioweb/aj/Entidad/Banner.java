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
public class Banner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_banner")
    private int id;
    private String titulo;

    @Lob
    @ValidFile(FileCategory.IMAGE)
    @Column(name = "img", nullable = false)
    private byte[] img;

    public Banner() {
    }

    public Banner(String titulo, byte[] img) {
        this.titulo = titulo;
        this.img = img;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

}
