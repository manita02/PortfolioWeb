package com.portfolioweb.aj.Entidad;

import com.portfolioweb.aj.Validacion.FileCategory;
import com.portfolioweb.aj.Validacion.ValidFile;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name = "organizacion")
public class Organizacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_organizacion")
    private Long id;

    private String nombre;

    private String ubicacion;

    @Column(length = 2048)
    private String urlWeb;

    @Lob
    @ValidFile(FileCategory.IMAGE)
    @Column(name = "logo_img", nullable = true)
    private byte[] logoImg;

    public Organizacion() {
    }

    public Organizacion(String nombre, String ubicacion, String urlWeb, byte[] logoImg) {
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

    public byte[] getLogoImg() {
        return logoImg;
    }

    public void setLogoImg(byte[] logoImg) {
        this.logoImg = logoImg;
    }
}
