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
  let { nome, estado, max_temp, min_temp, raio_busca, offset } = req.query;

  raio_busca = (raio_busca / 1.60934).toFixed(2);
  
  const cachedData = cache.get(`${nome}${estado}${max_temp}${min_temp}${raio_busca}${offset}`);

  if (cachedData)
    return res.status(200).send(cachedData);

  if (!nome || !estado || !max_temp || !min_temp || !raio_busca) {
    return res.status(400).send('Requisição inválida');
  }

  if (raio_busca > 100)
    return res.status(400).send('O raio de busca deve ser menor ou igual a 160km');

  const coordenadas = await CidadesRepositorio.getCoordenadas(nome, estado);

  try {
    const cidadesProximas = await CidadesRepositorio.getCidadesProximas(coordenadas.lat, coordenadas.lon, raio_busca, offset !== undefined ? offset : 0);

    const cidadesProximasResumidas = await Promise.all(cidadesProximas.map(async (element) => {
      const previsaoCompleta = await CidadesRepositorio.getPrevisaoDoTempo(element.latitude, element.longitude);
      const previsoesResumidas = CidadesRepositorio.processarPrevisao(previsaoCompleta);
      
      return {
        nome: element.name,
        estado: element.region,
        previsaoDoTempo: previsoesResumidas
      };
    }));

    const cidadesFiltradas = cidadesProximasResumidas.filter(element => 
      element.previsaoDoTempo.every(e => e.temp_max <= max_temp && e.temp_min >= min_temp)
    );

    cache.set(`${nome}${estado}${max_temp}${min_temp}${raio_busca}${offset}`, cidadesFiltradas);

    res.status(200).send(cidadesFiltradas);
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
    res.status(500).send('Erro ao gerar roteiro');
  }
});

// Criar e iniciar o servidor HTTPS
createServer(sslOptions, app).listen(443);
