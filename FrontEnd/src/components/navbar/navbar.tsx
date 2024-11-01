"use client";
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from '@mui/icons-material/Add';
import AddProductForm from "../formProduct/addProductForm";

interface NavbarProps {
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({ userName }) => {

    const [openForm, setOpenForm] = useState(false);
    const [exit, setExit] = useState(false);
    const handleOpenForm = () => {
        setOpenForm(true);
      };
    
      const handleCloseForm = () => {
        setOpenForm(false);
      };

      const handleExit = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        window.location.href = '/';
      }

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Ícone e botão para Estoque */}
        <IconButton color="inherit" edge="start">
          <InventoryIcon />
        </IconButton>
        <Button color="inherit">Estoque</Button>

        {/* Ícone e botão para Adicionar Produto */}
        <IconButton color="inherit" edge="start">
          <AddIcon />
        </IconButton>
        <Button color="inherit" onClick={handleOpenForm}>Adicionar Produto</Button>
        <AddProductForm open={openForm} onClose={handleCloseForm} />

        {/* Espaço flexível para empurrar os botões para a direita */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Nome do usuário */}
        <Typography variant="h6" component="div" sx={{ marginRight: 2 }}>
          Olá, {userName}
        </Typography>

        {/* Botão para Sair */}
        <Button color="inherit" startIcon={<ExitToAppIcon />} onClick={handleExit}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
};