const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 3600 });

class CidadesRepositorio {
    static getCidadesProximas = async (lat,lon, raio_busca, offset) => {
        const cacheKey = `${lat}${lon}${raio_busca}${offset}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData)
            return cachedData;

        const limit = 10;
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

            const uniqueCidades = CidadesRepositorio.removerDuplicados(response.data.data);

            allCidades = [...new Set([...allCidades, ...uniqueCidades])];

            currentOffset += remainingLimit;
            remainingLimit = limit - allCidades.length;
        }

        const result = {metadata: metadata ,cidades: allCidades.slice(0, limit)};

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

    static getPrevisaoDoTempo = async (lat, lon) => {
        const cachedData = cache.get(`${lat}${lon}`);
        
        if (cachedData)
            return cachedData;

        const response = await axios.get(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.CLIMATE_API_KEY}&units=metric`);
        
        cache.set(`${lat}${lon}`, response.data.list);

        return response.data.list;
    };

    static processarPrevisao = (previsaoCompleta) => {
        const datas = new Set(previsaoCompleta.map(e => e.dt_txt.split(' ')[0]));

        return [...datas].map(data => {
            const previsaoDoDia = previsaoCompleta.filter(e => e.dt_txt.startsWith(data));
            const temp_max = Math.max(...previsaoDoDia.map(e => e.main.temp_max));
            const temp_min = Math.min(...previsaoDoDia.map(e => e.main.temp_min));
            const chuva = previsaoDoDia.some(e => e.weather[0].main === 'Rain');
            return { data, temp_max: temp_max.toFixed(2), temp_min: temp_min.toFixed(2), chuva: chuva};
        });
    };
}

module.exports = CidadesRepositorio;
