const CidadesRepositorio = require('./CidadesRepositorio.js');
const RoteirosRepositorio = require('./RoteirosRepositorio.js');
const { createServer } = require('https');
const { readFileSync } = require('fs');
const express = require('express');
const NodeCache = require('node-cache');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });

app.use(express.json());

// Carregar os certificados SSL
const sslOptions = {
  key: readFileSync('key.pem'),
  cert: readFileSync('cert.pem')
};

app.get('/cidades', async (req, res) => {
  let { lat, lon, max_temp, min_temp, raio_busca, offset } = req.query;

  raio_busca = parseFloat(raio_busca).toFixed(2);
  
  const cachedData = cache.get(`${lat}${lon}${max_temp}${min_temp}${raio_busca}${offset}`);

  if (cachedData)
    return res.status(200).send(cachedData);

  if (!lat || !lon || !max_temp || !min_temp || !raio_busca) {
    return res.status(400).send('Requisição inválida');
  }

  latFloat = parseFloat(lat);
  lonFloat = parseFloat(lon);

  if (latFloat < -90 || latFloat > 90 || lonFloat < -180 || lonFloat > 180)
    return res.status(400).send('Coordenadas inválidas');

  if (max_temp < min_temp)
    return res.status(400).send('A temperatura máxima deve ser maior ou igual a temperatura mínima');

  if (raio_busca > 200 || raio_busca <= 0)
    return res.status(400).send('O raio de busca deve ser menor ou igual a 200km e maior que 0km');

  const coordenadas = { lat, lon };

  try {
    const cidadesProximas = await CidadesRepositorio.getCidadesProximas(coordenadas.lat, coordenadas.lon, raio_busca, offset !== undefined ? offset : 0);

    const cidadesProximasResumidas = await Promise.all(cidadesProximas.cidades.map(async (element) => {
      const previsaoCompleta = await CidadesRepositorio.getPrevisaoDoTempo(element.latitude, element.longitude);
      const previsoesResumidas = CidadesRepositorio.processarPrevisao(previsaoCompleta);
      
      return {
        nome: element.name,
        estado: element.region,
        distancia: element.distance,
        previsaoDoTempo: previsoesResumidas
      };
    }));

    const cidadesFiltradas = cidadesProximasResumidas.filter(element => 
      element.previsaoDoTempo.every(e => e.temp_max <= parseFloat(max_temp) && e.temp_min >= parseFloat(min_temp))
    );

    cache.set(`${lat}${lon}${max_temp}${min_temp}${raio_busca}${offset}`, cidadesFiltradas);

    res.status(200).send({metadata: cidadesProximas.metadata, cidades: cidadesFiltradas});
  } catch (error) {
    res.status(500).send('Erro ao buscar dados das cidades');
    console.error(error);
  }
});

app.post('/recomendacao', async (req, res) => {
  if (!req.body.cidades) {
    return res.status(400).send('Requisição inválida');
  }
  const infos = req.body.cidades;
  try {
    const roteiro = await RoteirosRepositorio.gerarRoteiro(infos);
    res.status(200).send(roteiro.text());
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Criar e iniciar o servidor HTTPS
createServer(sslOptions, app).listen(443);
