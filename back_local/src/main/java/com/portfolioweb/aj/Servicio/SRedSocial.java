
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoRedSocial;
import com.portfolioweb.aj.Entidad.RedSocial;
import com.portfolioweb.aj.Repositorio.RSocialNetworks;
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
public class SRedSocial {
    @Autowired
    RSocialNetworks rSocialNetworks;

    public List<dtoRedSocial> list(){
        return rSocialNetworks.findAllByOrderByIdDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<dtoRedSocial> getOne(int id){
        return rSocialNetworks.findById(id).map(this::toDto);
    }

    public Optional<RedSocial> getEntity(int id){
        return rSocialNetworks.findById(id);
    }

    public Optional<RedSocial> getByNombreRedS(String nombreRedS){
        return rSocialNetworks.findBynombreRedS(nombreRedS);
    }

    public void save(RedSocial redsocial){
        rSocialNetworks.save(redsocial);
    }

    public void delete(int id){
        rSocialNetworks.deleteById(id);
    }

    public boolean existsById(int id){
        return rSocialNetworks.existsById(id);
    }

    public boolean existsByNombreRedS(String nombreRedS){
        return rSocialNetworks.existsBynombreRedS(nombreRedS);
    }

    public RedSocial mapToEntity(dtoRedSocial dto, RedSocial redSocial, boolean isCreate) {
        redSocial.setNombreRedS(dto.getNombreRedS());
        redSocial.setLink(dto.getLink());
        if (isCreate || StringUtils.isNotBlank(dto.getImg())) {
            redSocial.setImg(decodeBase64(dto.getImg()));
        }
        return redSocial;
    }

    public dtoRedSocial toDto(RedSocial redSocial) {
        dtoRedSocial dto = new dtoRedSocial();
        dto.setId(redSocial.getId());
        dto.setNombreRedS(redSocial.getNombreRedS());
        dto.setImg(encodeBase64(redSocial.getImg()));
        dto.setLink(redSocial.getLink());
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
