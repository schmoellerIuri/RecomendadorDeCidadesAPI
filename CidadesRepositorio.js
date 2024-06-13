const axios = require('axios');
const NodeCache = require('node-cache');
require('dotenv').config();

const cache = new NodeCache({ stdTTL: 3600 });

class CidadesRepositorio {
    static getCidadesProximasPorTemperatura = async (lat, lon, max_temp, min_temp, raio_busca) => {
        const cidadesProximas = await this.getCidadesProximas(lat, lon, raio_busca);

        const previsaoCidades = await this.getPrevisaoCidades(cidadesProximas);

        const cidadesFiltradas = previsaoCidades.filter(element =>
            element.previsaoDoTempo.every(e => e.day.maxtemp_c <= parseFloat(max_temp) && e.day.mintemp_c >= parseFloat(min_temp))
        );

        return cidadesFiltradas;
    };

    static getCidadesProximas = async (lat, lon, raio_busca) => {
        const cacheKey = `${lat}${lon}${raio_busca}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData)
            return cachedData;

        const response = await axios.post(`https://places.googleapis.com/v1/places:searchNearby?fields=places.formattedAddress%2Cplaces.location&key=${process.env.PLACES_API_KEY}`,{
                includedTypes: ['administrative_area_level_2'],
                maxResultCount: 20,
                languageCode: 'pt-br',
                locationRestriction: {
                    circle: {
                        center: {
                            latitude: lat,
                            longitude: lon
                        },
                        radius: raio_busca * 1000
                    }
                }
            });

        cache.set(cacheKey, response.data.places);

        return response.data.places;
    };

    static getPrevisaoCidades = async (cidadesProximas) => {
        const previsaoCidades = await Promise.all(cidadesProximas.map(async (element) => {
            const previsaoCompleta = await this.getPrevisaoDoTempo(element.location.latitude, element.location.longitude);

            return {
                nome: element.formattedAddress,
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