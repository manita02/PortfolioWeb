
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoPersona;
import com.portfolioweb.aj.Entidad.Persona;
import com.portfolioweb.aj.Repositorio.IPersonaRepositorio;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class ImpPersonaServicio{
    @Autowired
    IPersonaRepositorio ipersonarepositorio;

    public List<dtoPersona> list(){
       return ipersonarepositorio.findAll().stream()
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   public Optional<dtoPersona> getOne(int id){
       return ipersonarepositorio.findById(id).map(this::toDto);
   }

   public Optional<Persona> getEntity(int id){
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

   public Persona mapToEntity(dtoPersona dto, Persona persona, boolean isCreate) {
       persona.setNombre(dto.getNombre());
       persona.setApellido(dto.getApellido());
       persona.setProfesion(dto.getProfesion());
       persona.setAcercaDe(dto.getAcercaDe());
       if (isCreate || StringUtils.isNotBlank(dto.getImg())) {
           persona.setImg(decodeBase64(dto.getImg()));
       }
       return persona;
   }

   public dtoPersona toDto(Persona persona) {
       dtoPersona dto = new dtoPersona();
       dto.setId(persona.getId());
       dto.setNombre(persona.getNombre());
       dto.setApellido(persona.getApellido());
       dto.setImg(encodeBase64(persona.getImg()));
       dto.setProfesion(persona.getProfesion());
       dto.setAcercaDe(persona.getAcercaDe());
       return dto;
   }

   private byte[] decodeBase64(String base64) {
       if (StringUtils.isBlank(base64)) {
           return null;
       }
       String data = base64.contains(",") ? base64.substring(base64.indexOf(",") + 1) : base64;
       return Base64.getDecoder().decode(data.trim());
   }

   private String encodeBase64(byte[] data) {
       if (data == null || data.length == 0) {
           return null;
       }
       return Base64.getEncoder().encodeToString(data);
   }
}
