"use client";
import { Typography } from "@mui/material";
import { Navbar } from "../../components/navbar/navbar"
import { useEffect, useState } from 'react';
import {Layout} from "../../components/stock/Layout"
import api from "@/services/api";



const App = () => {
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchData = async() => {
            try{
                const id = localStorage.getItem('id');
                const response = await api.get(`usuarios/${id}`);
                setName(response.data.nome)
            } catch(error){
                window.alert("Algo deu errado 😿");
                console.log(error);
            }
        }
        fetchData();
    },[])

    return (
      <div>
        <Navbar userName={name} />
        {/* Conteúdo da página */}
        <main>
          <Typography variant="h4" align="center" sx={{ marginTop: 4 }}>
            <Layout />
          </Typography>
        </main>
      </div>
    );
  };

export default App;