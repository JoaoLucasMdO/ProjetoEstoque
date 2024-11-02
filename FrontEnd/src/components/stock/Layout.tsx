"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import api from "@/services/api";
import EditProductForm from "../formProduct/editProductForm";

// Definindo a interface para os produtos
interface Product {
  id: number;
  nome: string;
  descricao: string;
  imagem: string | Blob | { type: string; data: number[] }; // Pode ser uma string, Blob ou Buffer
  valor: number;
  quantidade: number;
  imagemUrl?: string; // URL temporária para exibição da imagem
}

// Função para converter base64 em Blob
const base64ToBlob = (base64: string, type: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Uint8Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([byteNumbers], { type });
};

export const Layout = () => {
  const [pesq, setPesq] = useState("");
  const [id, setId] = useState(Number);
  const [listProducts, setProducts] = useState<Product[]>([]);
  const [openEditForm, setOpenEditForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("produtos", {
          responseType: "json",
        });

        // Processa cada produto e converte a imagem base64 para URL
        const productsWithImageURLs = response.data.map((product: Product) => {
          let imagemUrl;

          // Adicionando log para ver o que está em product.imagem
          console.log("Product:", product);

          if (product.imagem instanceof Blob) {
            // Se for um Blob, cria uma URL a partir dele
            imagemUrl = URL.createObjectURL(product.imagem);
          } else if (
            product.imagem &&
            typeof product.imagem === "object" &&
            product.imagem.type === "Buffer"
          ) {
            // Se for um Buffer, converte para base64
            const base64 = Buffer.from(product.imagem.data).toString("base64"); // Converte Buffer para base64
            imagemUrl = `data:${product.imagem.type};base64,${base64}`; // Cria a URL
          } else {
            console.error("Formato de imagem não suportado:", product.imagem);
          }

          return {
            ...product,
            imagemUrl, // A URL temporária para a imagem
          };
        });

        setProducts(productsWithImageURLs);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchData();

    // Cleanup para liberar memória ao desmontar o componente
    return () => {
      listProducts.forEach((product) => {
        if (product.imagemUrl) URL.revokeObjectURL(product.imagemUrl);
      });
    };
  }, []);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = api.delete(`produtos/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "access-token": token,
        },
      });
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir Produto", error);
    }
  };

  const handleOpenEditForm = (id: number) => {
    setId(id);
    setOpenEditForm(true);
  };

  const handleCloseEditForm = () => {
    setOpenEditForm(false);
  };

  return (
    <Grid container spacing={3}>
      {listProducts.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card>
            <CardMedia
              component="img"
              image={product.imagemUrl} // Usa a URL temporária
              alt={product.nome}
              style={{
                height: "200px", // Altura fixa para a imagem
                width: "100%", // Largura total do card
                objectFit: "cover", // Corta a imagem se necessário
              }}
            />
            <CardContent>
              <Typography variant="h6" component="div">
                {product.nome}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.descricao}
              </Typography>
              <Typography variant="body1" color="text.primary">
                Valor: R$ {product.valor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quantidade: {product.quantidade}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(product.id)}
              >
                Excluir Produto
              </Button>
              <Button
                variant="outlined"
                style={{ margin: 15 }}
                onClick={() => handleOpenEditForm(product.id)}
              >
                Editar Produto
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <EditProductForm
        open={openEditForm}
        onClose={handleCloseEditForm}
        id={id}
      />
    </Grid>
  );
};
