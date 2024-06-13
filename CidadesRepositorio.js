const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 3600 });

class CidadesRepositorio {
    static getCidadesProximasPorTemperatura = async (lat, lon, max_temp, min_temp, raio_busca, offset, limit = 10) => {
        const cidadesProximas = await this.getCidadesProximas(lat, lon, raio_busca, offset !== undefined ? parseInt(offset) : 0, limit);

        if (!cidadesProximas)
            throw new Error('Nenhuma cidade encontrada');

        const previsaoCidades = await this.getPrevisaoCidades(cidadesProximas.cidades);

        const cidadesFiltradas = previsaoCidades.filter(element => 
           element.previsaoDoTempo.every(e => e.day.maxtemp_c <= parseFloat(max_temp) && e.day.mintemp_c >= parseFloat(min_temp))
        );

        return {metadata: cidadesProximas.metadata, cidades: cidadesFiltradas};
    };

    static getCidadesProximas = async (lat,lon, raio_busca, offset, limit) => {
        const cacheKey = `${lat}${lon}${raio_busca}${offset}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData)
            return cachedData;

        let allCidades = [];
        let currentOffset = offset;
        let remainingLimit = limit;
        let metadata = {};

        while (allCidades.length < limit) {
            const response = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/locations/${lat}${lon}/nearbyPlaces`, {
                params: {
                    radius: raio_busca,
                    limit: remainingLimit,
                    offset: currentOffset,
                    types: 'CITY',
                    languageCode: 'pt-BR',
                    distanceUnit: 'KM'
                }
            });

            metadata = response.data.metadata;

            if (response.data.data.length === 0) {
                break; // Sai do loop se não houver mais resultados
            }

            const uniqueCidades = this.removerDuplicados(response.data.data);

            allCidades = allCidades.concat(uniqueCidades);

            currentOffset += remainingLimit;
            remainingLimit = limit - allCidades.length;
        }

        const result = {metadata: {nextPage: currentOffset, totalCount: metadata.totalCount} ,cidades: allCidades.slice(0, limit)};

        cache.set(cacheKey, result);

        return result;
    };

    static removerDuplicados = (cidades) => {
        let cidadesUnicas = [];
        for (let i = 0; i < cidades.length; i++) {
            if (!cidadesUnicas.some(e => e.name === cidades[i].name && e.region === cidades[i].region))
                cidadesUnicas.push({ name: cidades[i].name, region: cidades[i].region, latitude: cidades[i].latitude, longitude: cidades[i].longitude, distance: cidades[i].distance});
        }
        cidades = null;

        return cidadesUnicas;
    };

    static getPrevisaoCidades = async (cidadesProximas) => {
        const previsaoCidades = await Promise.all(cidadesProximas.map(async (element) => {
            const previsaoCompleta = await this.getPrevisaoDoTempo(element.latitude, element.longitude);
            
            return {
              nome: element.name,
              estado: element.region,
              distancia: element.distance,
              previsaoDoTempo: previsaoCompleta
            };
          }));

        return previsaoCidades;
    };

    static getPrevisaoDoTempo = async (lat, lon) => {
        const cachedData = cache.get(`${lat}${lon}`);
        
        if (cachedData)
            return cachedData;

        const response = await axios.get(`https://api.weatherapi.com/v1/forecast.json?`, {
            params: {
                key: process.env.WEATHER_API_KEY,
                q: `${lat},${lon}`,
                days: 5,
                lang: 'pt'
            }
        });
        
        cache.set(`${lat}${lon}`, response.data.forecast.forecastday);

        return response.data.forecast.forecastday;
    };
}

module.exports = CidadesRepositorio;