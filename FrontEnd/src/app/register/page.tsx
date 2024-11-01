"use client"
import React from 'react';
import { TextField, Button, Container, Typography, Link, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import api from '../../services/api';



const Register = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);

    try {
      const response = await api.post('http://localhost:3001/cadastro', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      window.alert(response.data.mensagem);
      window.location.href = '/'
    } catch (error) {
        window.alert("Algo deu errado 😿");
        console.log(error)
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" style={{color:"black"}}>
          Cadastro
        </Typography>
        <Box component="form" id='form' method='submit' sx={{ mt: 1 }} onSubmit={handleSubmit}>
        <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome"
            name="nome"
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
          <Link href="/" variant="body2">
            {"Já tem uma conta? Faça login"}
          </Link>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;