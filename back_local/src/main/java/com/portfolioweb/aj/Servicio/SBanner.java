
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoBanner;
import com.portfolioweb.aj.Entidad.Banner;
import com.portfolioweb.aj.Excepcion.ArchivoInvalidoException;
import com.portfolioweb.aj.Repositorio.RBanner;
import com.portfolioweb.aj.Util.ArchivoUtil;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class SBanner {
   @Autowired
   RBanner rBanner;

   public List<dtoBanner> list(){
       return rBanner.findAll().stream()
               .map(this::toDto)
               .collect(Collectors.toList());
   }

   public Optional<dtoBanner> getOne(int id){
       return rBanner.findById(id).map(this::toDto);
   }

   public Optional<Banner> getEntity(int id){
       return rBanner.findById(id);
   }

   public Optional<Banner> getByTitulo(String titulo){
       return rBanner.findByTitulo(titulo);
   }

   public void save(Banner banner){
       rBanner.save(banner);
   }

   public void delete(int id){
       rBanner.deleteById(id);
   }

   public boolean existsById(int id){
       return rBanner.existsById(id);
   }

   public boolean existsByTitulo(String titulo){
       return rBanner.existsByTitulo(titulo);
   }

   public Banner mapToEntity(dtoBanner dto, Banner banner, boolean isCreate) {
       banner.setTitulo(dto.getTitulo());
       if (isCreate || StringUtils.isNotBlank(dto.getImg())) {
           ArchivoUtil.ResultadoArchivo resultado = ArchivoUtil.procesarImagen(dto.getImg());
           if (resultado.tieneError()) {
               throw new ArchivoInvalidoException(resultado.getMensajeError());
           }
           banner.setImg(resultado.getBytes());
       }
       return banner;
   }

   public dtoBanner toDto(Banner banner) {
       dtoBanner dto = new dtoBanner();
       dto.setId(banner.getId());
       dto.setTitulo(banner.getTitulo());
       dto.setImg(ArchivoUtil.codificarBase64(banner.getImg()));
       return dto;
   }
}
