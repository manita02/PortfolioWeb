/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.portfolioweb.aj.Repositorio;

import com.portfolioweb.aj.Entidad.Educacion;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface REduacion extends JpaRepository<Educacion, Integer>{
    public Optional<Educacion> findByNombreE(String nombreE); 
    public boolean existsByNombreE(String nombreE); 
}
