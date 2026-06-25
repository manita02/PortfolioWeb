package com.portfolioweb.aj.Entidad;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

@Entity
public class Educacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_educacion")
    private int id;

    private String nombreE;

    private String descripcionE;

    private String fechaInicio;

    private String fechaFin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tipo_educacion")
    private TipoEducacion tipoEducacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_organizacion")
    private Organizacion organizacion;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "educacion_habilidades", joinColumns = @JoinColumn(name = "id_educacion"), inverseJoinColumns = @JoinColumn(name = "id_habilidad"))
    private List<Habilidad> habilidades = new ArrayList<>();

    @Lob
    @Column(name = "archivo_imagen", nullable = true)
    private byte[] archivoImagen;

    @Lob
    @Column(name = "archivo_pdf", nullable = true)
    private byte[] archivoPdf;

    public Educacion() {
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

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public TipoEducacion getTipoEducacion() {
        return tipoEducacion;
    }

    public void setTipoEducacion(TipoEducacion tipoEducacion) {
        this.tipoEducacion = tipoEducacion;
    }

    public Organizacion getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(Organizacion organizacion) {
        this.organizacion = organizacion;
    }

    public List<Habilidad> getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(List<Habilidad> habilidades) {
        this.habilidades = habilidades;
    }

    public byte[] getArchivoImagen() {
        return archivoImagen;
    }

    public void setArchivoImagen(byte[] archivoImagen) {
        this.archivoImagen = archivoImagen;
    }

    public byte[] getArchivoPdf() {
        return archivoPdf;
    }

    public void setArchivoPdf(byte[] archivoPdf) {
        this.archivoPdf = archivoPdf;
    }
}
