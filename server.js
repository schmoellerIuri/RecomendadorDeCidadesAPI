const https = require('https');
const fs = require('fs');
const express = require('express');
const axios = require('axios');

const API_KEY = '7e6677b8e51126cf19eebec53364fc7f';
const USR_API = 'iurisch';
const app = express();

app.use(express.json());

// Carregar os certificados SSL
const sslOptions = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Função para obter cidades próximas pelo raio de busca
const getCidadesProximas = async (lat,lon, raio_busca) => {
  const response = await axios.get(`http://api.geonames.org/findNearbyPlaceNameJSON?lat=${lat}&lng=${lon}&username=${USR_API}&radius=${raio_busca}`);
  return response.data.geonames;
};

// Função para obter coordenadas geográficas
const getCoordenadas = async (cidade, estado) => {
  const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cidade},${estado},BR&limit=1&appid=${API_KEY}`);
  return response.data[0];
};

// Função para obter previsão do tempo
const getPrevisaoDoTempo = async (lat, lon) => {
  const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  return response.data.list;
};

// Função para processar a previsão do tempo
const processarPrevisao = (previsaoCompleta) => {
  const datas = new Set(previsaoCompleta.map(e => e.dt_txt.split(' ')[0]));

  return [...datas].map(data => {
    const previsaoDoDia = previsaoCompleta.filter(e => e.dt_txt.startsWith(data));
    const temp_max = Math.max(...previsaoDoDia.map(e => e.main.temp_max - 273.15));
    const temp_min = Math.min(...previsaoDoDia.map(e => e.main.temp_min - 273.15));
    return { data, temp_max: temp_max.toFixed(2), temp_min: temp_min.toFixed(2) };
  });
};

app.get('/cidades', async (req, res) => {
  const { nome, estado, max_temp, min_temp, raio_busca } = req.query;

  if (!nome || !estado || !max_temp || !min_temp || !raio_busca) {
    return res.status(400).send('Requisição inválida');
  }

  const coordenadas = await getCoordenadas(nome, estado);

  try {
    const cidadesProximas = await getCidadesProximas(coordenadas.lat, coordenadas.lon, raio_busca);

    const cidadesProximasResumidas = await Promise.all(cidadesProximas.map(async (element) => {
      const previsaoCompleta = await getPrevisaoDoTempo(element.lat, element.lng);
      const previsoesResumidas = processarPrevisao(previsaoCompleta);
      
      return {
        nome: element.toponymName,
        estado: element.adminName1,
        previsaoDoTempo: previsoesResumidas
      };
    }));

    const cidadesFiltradas = cidadesProximasResumidas.filter(element => 
      element.previsaoDoTempo.every(e => e.temp_max <= max_temp && e.temp_min >= min_temp)
    );

    res.status(200).send(cidadesFiltradas);
  } catch (error) {
    res.status(500).send('Erro ao buscar dados das cidades');
    console.error(error);
  }
});

// Criar e iniciar o servidor HTTPS
https.createServer(sslOptions, app).listen(443, () => {
  console.log('Servidor HTTPS rodando na porta 443');
});
