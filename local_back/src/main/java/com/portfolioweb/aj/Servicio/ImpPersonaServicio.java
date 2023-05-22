
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Entidad.Persona;

import com.portfolioweb.aj.Repositorio.IPersonaRepositorio;
import java.util.List;
import java.util.Optional;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service 
@Transactional
public class ImpPersonaServicio{
    @Autowired 
    IPersonaRepositorio ipersonarepositorio;
    
    public List<Persona> list(){
       return ipersonarepositorio.findAll(); 
   }
   
   public Optional<Persona> getOne(int id){
       return ipersonarepositorio.findById(id); 
   }
   
   public Optional<Persona> getByNombre(String nombre){
       return ipersonarepositorio.findBynombre(nombre); 
   }
   
   public void save(Persona persona){
       ipersonarepositorio.save(persona); 
   }
   
   public void delete(int id){
       ipersonarepositorio.deleteById(id);
   }
   
   public boolean existsById(int id){
       return ipersonarepositorio.existsById(id); 
   }
   
   public boolean existsByNombre(String nombre){
       return ipersonarepositorio.existsBynombre(nombre);
   }
   
}

