
package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoRedSocial;
import com.portfolioweb.aj.Entidad.RedSocial;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SRedSocial;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("redesSociales")
@CrossOrigin(origins = "http://localhost:4200")
public class CRedSocial {
    @Autowired
    SRedSocial sRedSocial;
    
    @GetMapping("/lista")
    public ResponseEntity<List<RedSocial>> list(){
        List<RedSocial> list = sRedSocial.list(); 
        return new ResponseEntity(list,HttpStatus.OK); 
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<RedSocial> getById(@PathVariable("id") int id){
        if(!sRedSocial.existsById(id))
            return new ResponseEntity(new Mensaje("no existe"), HttpStatus.NOT_FOUND);
        RedSocial redSocial = sRedSocial.getOne(id).get();
        return new ResponseEntity(redSocial, HttpStatus.OK);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id){
        //validacion si existe el ID
        if(!sRedSocial.existsById(id))
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST);
        sRedSocial.delete(id);
        
        return new ResponseEntity(new Mensaje("Red Social eliminada"), HttpStatus.OK); 
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoRedSocial dtoredsocial){
        if(StringUtils.isBlank(dtoredsocial.getNombreRedS()))
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoredsocial.getImg()))
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoredsocial.getLink()))
            return new ResponseEntity(new Mensaje("La URL es obligatoria"),HttpStatus.BAD_REQUEST);
        
    
        if(sRedSocial.existsByNombreRedS(dtoredsocial.getNombreRedS()))
            return new ResponseEntity(new Mensaje("Esa red social ya existe"),HttpStatus.BAD_REQUEST); 
        
        if(sRedSocial.existsByNombreRedS(dtoredsocial.getImg())){
            return new ResponseEntity(new Mensaje("Esa imagen ya esta agregada"), HttpStatus.BAD_REQUEST); 
        }
        
        if(sRedSocial.existsByNombreRedS(dtoredsocial.getLink())){
            return new ResponseEntity(new Mensaje("Esa URL ya esta agregada"), HttpStatus.BAD_REQUEST); 
        }
    
        RedSocial redsocial = new RedSocial(dtoredsocial.getNombreRedS(), dtoredsocial.getImg(), dtoredsocial.getLink()); 
        sRedSocial.save(redsocial);
        
        return new ResponseEntity(new Mensaje ("Red Social agregada"), HttpStatus.OK); 
    
    }
    
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoRedSocial dtoredsocial){
        
        //validacion si existe el ID
        if(!sRedSocial.existsById(id))
            return new ResponseEntity(new Mensaje("El ID no existe"), HttpStatus.BAD_REQUEST); 
        
        
        //comparacion del nombre experiencia
        if(sRedSocial.existsByNombreRedS(dtoredsocial.getNombreRedS()) && sRedSocial.getByNombreRedS(dtoredsocial.getNombreRedS()).get().getId() != id ){
            return new ResponseEntity(new Mensaje("Esa Red Social ya existe"), HttpStatus.BAD_REQUEST);
        }
        
      
        //el campo no puede estar vacio
        if(StringUtils.isBlank(dtoredsocial.getNombreRedS()))
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"), HttpStatus.BAD_REQUEST); 
        
        if(StringUtils.isBlank(dtoredsocial.getImg()))
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST);
        
        if(StringUtils.isBlank(dtoredsocial.getLink()))
            return new ResponseEntity(new Mensaje("La URL es obligatoria"),HttpStatus.BAD_REQUEST);
        
        
    
        RedSocial redSocial = sRedSocial.getOne(id).get();
        redSocial.setNombreRedS(dtoredsocial.getNombreRedS());
        redSocial.setLink(dtoredsocial.getLink());
        redSocial.setImg(dtoredsocial.getImg());
        
        sRedSocial.save(redSocial); 
        return new ResponseEntity(new Mensaje("Red Social actualizada"), HttpStatus.OK);      
    
    }
    
    
}
