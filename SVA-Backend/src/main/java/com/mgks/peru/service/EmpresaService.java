package com.mgks.peru.service;

import com.mgks.peru.model.Cliente;
import com.mgks.peru.model.Sucursal;
import com.mgks.peru.repository.ClienteRepository;
import com.mgks.peru.repository.SucursalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EmpresaService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private SucursalRepository sucursalRepository;

    public List<Cliente> listarTodasLasEmpresas() {
        return clienteRepository.findAll();
    }

    public void guardarEmpresa(Cliente cliente) {

        if (clienteRepository.findByRuc(cliente.getRuc()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El RUC " + cliente.getRuc() + " ya pertenece a otra empresa en el sistema."
            );
        }

        if (cliente.getSucursales() != null) {
            for (Sucursal sucursal : cliente.getSucursales()) {

                sucursal.setCliente(cliente);
            }
        }

        clienteRepository.save(cliente);
    }

   
    public void registrarSucursalEnEmpresa(Long clienteId, Sucursal nuevaSucursal) {
        Cliente clienteExistente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Error: No se encontró la empresa corporativa con el ID: " + clienteId
        ));

        nuevaSucursal.setCliente(clienteExistente);

        sucursalRepository.save(nuevaSucursal);
    }
}
