const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 3600 });

class CidadesRepositorio {
    static getCidadesProximas = async (lat,lon, raio_busca, offset) => {
        const cachedData = cache.get(`${lat}${lon}${raio_busca}${offset}`);

        if (cachedData)
            return cachedData;
        
        const response = await axios.get(`http://geodb-free-service.wirefreethought.com/v1/geo/locations/${lat}${lon}/nearbyPlaces`, {
            params: {
                radius: raio_busca,
                limit: 10,
                offset: offset,
                types: 'CITY',
                languageCode: 'pt-BR'
            }
        });

        //remover registros com nome e estado duplicados
        const result = CidadesRepositorio.removerDuplicados(response.data.data);

        cache.set(`${lat}${lon}${raio_busca}${offset}`, result);

        return result;
    };

    static removerDuplicados = (cidades) => {
        let cidadesUnicas = [];
        for (let i = 0; i < cidades.length; i++) {
            if (cidadesUnicas.length === 0)
                cidadesUnicas.push(cidades[i]);
            else if (cidadesUnicas.at(-1).name != cidades[i].name || cidadesUnicas.at(-1).region != cidades[i].region) {
                cidadesUnicas.push(cidades[i]);
            }
        }

        return cidadesUnicas;
    };

    static getCoordenadas = async (cidade, estado) => {
        const cachedData = cache.get(`${cidade}${estado}`);

        if (cachedData)
            return cachedData;

        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${cidade},${estado},BR&limit=1&appid=${process.env.CLIMATE_API_KEY}`);

        cache.set(`${cidade}${estado}`, response.data[0]);

        return response.data[0];
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
