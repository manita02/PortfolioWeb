
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoBanner;
import com.portfolioweb.aj.Entidad.Banner;
import com.portfolioweb.aj.Repositorio.RBanner;
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
           banner.setImg(decodeBase64(dto.getImg()));
       }
       return banner;
   }

   public dtoBanner toDto(Banner banner) {
       dtoBanner dto = new dtoBanner();
       dto.setId(banner.getId());
       dto.setTitulo(banner.getTitulo());
       dto.setImg(encodeBase64(banner.getImg()));
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
