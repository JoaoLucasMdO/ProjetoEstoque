import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import api from "@/services/api";

interface AddProductFormProps {
  open: boolean;
  onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ open, onClose }) => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState<number | string>("");
  const [quantidade, setQuantidade] = useState<number | string>("");
  const [foto, setFoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    const token = localStorage.getItem("token")
    e.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("valor", String(valor));
    formData.append("quantidade", String(quantidade));
    if (foto) {
      formData.append("foto", foto);
    }

    try {
      await api.post("produtos", formData, {headers: {
        'Content-Type': 'multipart/form-data',
        'access-token': token
      }});
      // Resetar os campos
      setNome("");
      setDescricao("");
      setValor("");
      setQuantidade("");
      setFoto(null);
      onClose(); // Fecha o formulário após o envio
      window.location.reload();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar Produto</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Valor"
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            fullWidth
            margin="normal"
          />
          <input
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFoto(e.target.files[0]);
              }
            }}
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancelar
            </Button>
            <Button type="submit" color="primary">
              Adicionar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;