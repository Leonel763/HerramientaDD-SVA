package com.mgks.peru.service;

import com.mgks.peru.model.Usuario;
import com.mgks.peru.repository.UsuarioRepository;
import com.mgks.peru.repository.TareaOperativaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository trabajadorRepository;

    @Autowired
    private TareaOperativaRepository tareaOperativaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodo() {
        return trabajadorRepository.findAll();
    }

    public void guardar(Usuario trabajador) {
        trabajador.setPassword(passwordEncoder.encode(trabajador.getPassword()));
        trabajadorRepository.save(trabajador);
    }

    public void actualizar(String dni, Usuario datosNuevos) {
        Usuario usuarioExistente = trabajadorRepository.findById(dni)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trabajador no encontrado con DNI: " + dni));

        usuarioExistente.setNombre(datosNuevos.getNombre());
        usuarioExistente.setApellidos(datosNuevos.getApellidos());
        usuarioExistente.setTelefono(datosNuevos.getTelefono());
        usuarioExistente.setSueldoBase(datosNuevos.getSueldoBase());
        usuarioExistente.setBanco(datosNuevos.getBanco());
        usuarioExistente.setNumeroCuenta(datosNuevos.getNumeroCuenta());
        
        if (datosNuevos.getPassword() != null && !datosNuevos.getPassword().trim().isEmpty() && !datosNuevos.getPassword().equals("••••••••")) {
            usuarioExistente.setPassword(passwordEncoder.encode(datosNuevos.getPassword()));
        }

        trabajadorRepository.save(usuarioExistente);
    }

    @Transactional
    public boolean eliminar(String dni) {
        Usuario usuario = trabajadorRepository.findById(dni).orElse(null);

        if (usuario == null) {
            return false;
        }

        if ("SUPERADMINISTRADOR".equals(usuario.getRol())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Acción denegada: El Super Administrador es intocable en el sistema MGKS."
            );
        }

        tareaOperativaRepository.deleteByUsuarioDni(dni);
        trabajadorRepository.deleteById(dni);
        return true;
    }

    public Usuario buscarPorDni(String dni) {
        return trabajadorRepository.findById(dni).orElse(null);
    }
}