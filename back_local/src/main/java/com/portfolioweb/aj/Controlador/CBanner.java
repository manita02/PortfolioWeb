
package com.portfolioweb.aj.Controlador;

import com.portfolioweb.aj.Dto.dtoBanner;
import com.portfolioweb.aj.Entidad.Banner;
import com.portfolioweb.aj.Seguridad.Controller.Mensaje;
import com.portfolioweb.aj.Servicio.SBanner;
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
@RequestMapping("/banner")
@CrossOrigin(origins = "http://localhost:4200")
public class CBanner {
    @Autowired
    SBanner sBanner; 
    
    @GetMapping("/lista")
    public ResponseEntity<List<Banner>> list(){
        List<Banner> list = sBanner.list(); 
        return new ResponseEntity(list, HttpStatus.OK); 
    }
    
    @GetMapping("/detail/{id}")
    public ResponseEntity<Banner> getById(@PathVariable("id")int id){
        if(!sBanner.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        Banner banner = sBanner.getOne(id).get(); 
        return new ResponseEntity(banner, HttpStatus.OK);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") int id){
       if(!sBanner.existsById(id)){
           return new ResponseEntity(new Mensaje("No existe el ID"), HttpStatus.NOT_FOUND); 
       }
       sBanner.delete(id);
       return new ResponseEntity(new Mensaje("Banner eliminado"), HttpStatus.OK); 
    }
    
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody dtoBanner dtobanner){
        if(StringUtils.isBlank(dtobanner.getTitulo())){
            return new ResponseEntity(new Mensaje("El nombre es obligatorio"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtobanner.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        
        
        if(sBanner.existsByTitulo(dtobanner.getTitulo())){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
        if(sBanner.existsByTitulo(dtobanner.getImg())){
            return new ResponseEntity(new Mensaje("Ese imagen ya esta agregada"), HttpStatus.BAD_REQUEST); 
        }
        
        
        Banner educacion = new Banner(dtobanner.getTitulo(), dtobanner.getImg());
        sBanner.save(educacion);
        return new ResponseEntity(new Mensaje ("Banner creado"), HttpStatus.OK); 
    
    }
    
    
    @PutMapping("/update/{id}") 
    public ResponseEntity<?> update(@PathVariable("id") int id, @RequestBody dtoBanner dtobanner){       
        if(!sBanner.existsById(id)){
            return new ResponseEntity(new Mensaje ("No existe el ID"), HttpStatus.NOT_FOUND); 
        }
        
        if(sBanner.existsByTitulo(dtobanner.getTitulo()) && sBanner.getByTitulo(dtobanner.getTitulo()).get().getId() != id){
            return new ResponseEntity(new Mensaje("Ese nombre ya existe"), HttpStatus.BAD_REQUEST); 
        }
        
        
        if(sBanner.existsByTitulo(dtobanner.getImg()) && sBanner.getByTitulo(dtobanner.getImg()).get().getId() != id){
            return new ResponseEntity(new Mensaje("Esa imagen ya esta agregada"), HttpStatus.BAD_REQUEST); 
        }
         
       
        if(StringUtils.isBlank(dtobanner.getTitulo())){
            return new ResponseEntity(new Mensaje("El campo no puede estar vacío"),HttpStatus.BAD_REQUEST); 
        }
        
        if(StringUtils.isBlank(dtobanner.getImg())){
            return new ResponseEntity(new Mensaje("La imagen es obligatoria"),HttpStatus.BAD_REQUEST); 
        }
        
        Banner banner = sBanner.getOne(id).get(); 
        
        banner.setTitulo(dtobanner.getTitulo());
        banner.setImg(dtobanner.getImg());
        
        
        
        
        sBanner.save(banner);
        
        return new ResponseEntity(new Mensaje("Banner actualizado"), HttpStatus.OK); 
    }
}
