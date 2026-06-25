package com.portfolioweb.aj.Entidad;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "habilidad")
public class Habilidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Lob
    @Column(name = "img", nullable = false)
    private byte[] img;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_habilidad_id", nullable = false)
    private TipoHabilidad tipoHabilidad;

    public Habilidad() {
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

    public byte[] getImg() {
        return img;
    }

    public void setImg(byte[] img) {
        this.img = img;
    }

    public TipoHabilidad getTipoHabilidad() {
        return tipoHabilidad;
    }

    public void setTipoHabilidad(TipoHabilidad tipoHabilidad) {
        this.tipoHabilidad = tipoHabilidad;
    }
}
