package com.mgks.peru;

import com.mgks.peru.model.Usuario;
import com.mgks.peru.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.util.ArrayList;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import com.mgks.peru.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository trabajadorRepository;

    @Mock
    private PasswordEncoder passwordEncoder; // <-- NUEVO: Evita el NullPointerException

    @InjectMocks
    private UsuarioService service;

    @Test
    public void testGuardarTrabajador() {
        Usuario nuevoTrabajador = new Usuario();
        nuevoTrabajador.setDni("55667788");
        nuevoTrabajador.setNombre("Juan Trabajador");
        nuevoTrabajador.setPassword("trabajador123");

        List<Usuario> listaSimulada = new ArrayList<>();
        listaSimulada.add(nuevoTrabajador);

      
        when(passwordEncoder.encode(anyString())).thenReturn("passwordEncriptadoTexto");
        when(trabajadorRepository.findAll()).thenReturn(listaSimulada);

        service.guardar(nuevoTrabajador);
        int tamanoActual = service.listarTodo().size();

        assertEquals(1, tamanoActual);
        verify(passwordEncoder).encode(anyString());
        verify(trabajadorRepository).save(any(Usuario.class));
    }
}