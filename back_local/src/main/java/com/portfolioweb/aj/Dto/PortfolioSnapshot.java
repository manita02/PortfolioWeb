package com.portfolioweb.aj.Dto;

import java.util.ArrayList;
import java.util.List;

public class PortfolioSnapshot {

    private String exportedAt;
    private List<dtoBanner> banner = new ArrayList<>();
    private List<dtoPersona> persona = new ArrayList<>();
    private List<dtoEducacion> educacion = new ArrayList<>();
    private List<dtoExperiencia> experiencia = new ArrayList<>();
    private List<dtoProyecto> proyecto = new ArrayList<>();
    private List<dtoHabilidad> habilidades = new ArrayList<>();
    private List<dtoRedSocial> redesSociales = new ArrayList<>();
    private List<dtoOrganizacion> organizacion = new ArrayList<>();
    private List<dtoTipoHabilidad> tipoHabilidad = new ArrayList<>();
    private List<dtoTipoEducacion> tipoEducacion = new ArrayList<>();
    private List<dtoTipoEmpleo> tipoEmpleo = new ArrayList<>();
    private List<dtoTipoUbicacion> tipoUbicacion = new ArrayList<>();

    public String getExportedAt() {
        return exportedAt;
    }

    public void setExportedAt(String exportedAt) {
        this.exportedAt = exportedAt;
    }

    public List<dtoBanner> getBanner() {
        return banner;
    }

    public void setBanner(List<dtoBanner> banner) {
        this.banner = banner;
    }

    public List<dtoPersona> getPersona() {
        return persona;
    }

    public void setPersona(List<dtoPersona> persona) {
        this.persona = persona;
    }

    public List<dtoEducacion> getEducacion() {
        return educacion;
    }

    public void setEducacion(List<dtoEducacion> educacion) {
        this.educacion = educacion;
    }

    public List<dtoExperiencia> getExperiencia() {
        return experiencia;
    }

    public void setExperiencia(List<dtoExperiencia> experiencia) {
        this.experiencia = experiencia;
    }

    public List<dtoProyecto> getProyecto() {
        return proyecto;
    }

    public void setProyecto(List<dtoProyecto> proyecto) {
        this.proyecto = proyecto;
    }

    public List<dtoHabilidad> getHabilidades() {
        return habilidades;
    }

    public void setHabilidades(List<dtoHabilidad> habilidades) {
        this.habilidades = habilidades;
    }

    public List<dtoRedSocial> getRedesSociales() {
        return redesSociales;
    }

    public void setRedesSociales(List<dtoRedSocial> redesSociales) {
        this.redesSociales = redesSociales;
    }

    public List<dtoOrganizacion> getOrganizacion() {
        return organizacion;
    }

    public void setOrganizacion(List<dtoOrganizacion> organizacion) {
        this.organizacion = organizacion;
    }

    public List<dtoTipoHabilidad> getTipoHabilidad() {
        return tipoHabilidad;
    }

    public void setTipoHabilidad(List<dtoTipoHabilidad> tipoHabilidad) {
        this.tipoHabilidad = tipoHabilidad;
    }

    public List<dtoTipoEducacion> getTipoEducacion() {
        return tipoEducacion;
    }

    public void setTipoEducacion(List<dtoTipoEducacion> tipoEducacion) {
        this.tipoEducacion = tipoEducacion;
    }

    public List<dtoTipoEmpleo> getTipoEmpleo() {
        return tipoEmpleo;
    }

    public void setTipoEmpleo(List<dtoTipoEmpleo> tipoEmpleo) {
        this.tipoEmpleo = tipoEmpleo;
    }

    public List<dtoTipoUbicacion> getTipoUbicacion() {
        return tipoUbicacion;
    }

    public void setTipoUbicacion(List<dtoTipoUbicacion> tipoUbicacion) {
        this.tipoUbicacion = tipoUbicacion;
    }
}
