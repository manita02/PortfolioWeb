
package com.portfolioweb.aj.Servicio;

import com.portfolioweb.aj.Dto.dtoRedSocial;
import com.portfolioweb.aj.Entidad.RedSocial;
import com.portfolioweb.aj.Excepcion.ArchivoInvalidoException;
import com.portfolioweb.aj.Repositorio.RSocialNetworks;
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
            ArchivoUtil.ResultadoArchivo resultado = ArchivoUtil.procesarImagen(dto.getImg());
            if (resultado.tieneError()) {
                throw new ArchivoInvalidoException(resultado.getMensajeError());
            }
            redSocial.setImg(resultado.getBytes());
        }
        return redSocial;
    }

    public dtoRedSocial toDto(RedSocial redSocial) {
        dtoRedSocial dto = new dtoRedSocial();
        dto.setId(redSocial.getId());
        dto.setNombreRedS(redSocial.getNombreRedS());
        dto.setImg(ArchivoUtil.codificarBase64(redSocial.getImg()));
        dto.setLink(redSocial.getLink());
        return dto;
    }
}
