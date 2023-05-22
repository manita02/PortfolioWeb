/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.portfolioweb.aj.Seguridad.Entity;

import com.portfolioweb.aj.Entidad.Banner;
import com.portfolioweb.aj.Entidad.Educacion;
import com.portfolioweb.aj.Entidad.Experiencia;
import com.portfolioweb.aj.Entidad.Habilidades;
import com.portfolioweb.aj.Entidad.Persona;
import com.portfolioweb.aj.Entidad.Proyecto;
import com.portfolioweb.aj.Entidad.RedSocial;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;

@Entity
public class Usuario{
    
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    int id; 
    @NotNull
    private String nombre; 
    @NotNull
    @Column(unique = true)
    private String nombreUsuario;
    @NotNull
    private String email; 
    @NotNull
    private String password;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "usuario_rol", joinColumns = @JoinColumn(name = "usuario_id"), inverseJoinColumns = @JoinColumn(name = "rol_id"))
    private Set<Rol> roles = new HashSet<>();
    
    @ManyToOne
    @JoinColumn(name = "id_persona")
    Persona persona;
    
    @ManyToOne
    @JoinColumn(name = "id_banner")
    Banner banner; 
    
    @ManyToOne
    @JoinColumn(name = "id_educacion")
    Educacion eduacion; 
    
    @ManyToOne
    @JoinColumn(name = "id_experiencia")
    Experiencia experiencia;
    
    
    @ManyToOne
    @JoinColumn(name = "id_habilidades")
    Habilidades habilidades; 
    
    @ManyToOne
    @JoinColumn(name = "id_proyecto")
    Proyecto proyecto; 
    
    @ManyToOne
    @JoinColumn(name = "id_red")
    RedSocial redSocial; 
   
    
    //Constructores 

    public Usuario() {
    }

    public Usuario(String nombre, String nombreUsuario, String email, String password) {
        this.nombre = nombre;
        this.nombreUsuario = nombreUsuario;
        this.email = email;
        this.password = password;
    }
    
    
    //Getter y Setter 
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Rol> getRoles() {
        return roles;
    }

    public void setRoles(Set<Rol> roles) {
        this.roles = roles;
    }
    
    

}
