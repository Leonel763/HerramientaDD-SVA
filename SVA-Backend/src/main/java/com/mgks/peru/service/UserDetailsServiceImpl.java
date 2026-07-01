package com.mgks.peru.service;

import com.mgks.peru.model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import com.mgks.peru.repository.UsuarioRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioRepository trabajadorRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Optional<Usuario> trabajadorOpt = trabajadorRepository.findById(username);

        if (trabajadorOpt.isPresent()) {
            Usuario trabajador = trabajadorOpt.get();
            
           
            String rolFinal = trabajador.getRol().toUpperCase().trim(); 
            
            return new User(
                    trabajador.getDni(), 
                    trabajador.getPassword(),
                    Collections.singletonList(new SimpleGrantedAuthority(rolFinal))
            );
        }

        throw new UsernameNotFoundException("Usuario no encontrado en el sistema MGKS: " + username);
    }
}