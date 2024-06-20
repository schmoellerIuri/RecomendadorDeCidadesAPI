const CidadesRepositorio = require('./CidadesRepositorio.js');
const RoteirosRepositorio = require('./RoteirosRepositorio.js');
const express = require('express');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });

app.use(express.json());

app.use(cors({
  origin: '*', // Permitir todas as origens
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

  if (parseFloat(max_temp) < parseFloat(min_temp))
    return res.status(400).send('A temperatura máxima deve ser maior ou igual a temperatura mínima');

  if (raio_busca > 200 || raio_busca <= 0)
    return res.status(400).send('O raio de busca deve ser menor ou igual a 200km e maior que 0km');

  try {
    let result = {metadata: {nextPage: offset, totalCount: 0}, cidades: []};
    let limit = 10;	
    let remainingLimit = limit;

    while(result.cidades.length < limit) {
      const dados = await CidadesRepositorio.getCidadesProximasPorTemperatura(lat, lon, max_temp, min_temp, raio_busca, result.metadata.nextPage, remainingLimit);
      result.metadata = dados.metadata;
      result.cidades = result.cidades.concat(dados.cidades);

      remainingLimit = limit - result.cidades.length;
      if (result.metadata.nextPage >= result.metadata.totalCount)
        break;
    }

    cache.set(`${lat}${lon}${max_temp}${min_temp}${raio_busca}${offset}`, result);

    res.status(200).send(result);
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
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    await RoteirosRepositorio.gerarRoteiro(infos, res);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(5000, () => { console.log('Server running') });
