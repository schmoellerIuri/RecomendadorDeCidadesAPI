# Cidades e Roteiros Recomendados

Este projeto implementa um servidor de recomendações de cidades com base no clima, utilizando a API GeoDB e a API OpenWeather para obter informações geográficas e de previsão do tempo, respectivamente. Ele oferece dois endpoints principais: um para buscar cidades próximas e outro para gerar recomendações de roteiros de viagem.
A geração dos roteiros é feita por meio da API do modelo de linguagem Google Gemini.

## Funcionalidades

1. **Buscar Cidades Próximas**: 
   - Endpoint: `/cidades`
   - Método: `GET`
   - Descrição: Retorna uma lista de cidades próximas a uma determinada coordenada geográfica, filtradas pela previsão do tempo.
   - Parâmetros:
     - `lat` (float): Latitude do ponto de referência.
     - `lon` (float): Longitude do ponto de referência.
     - `max_temp` (float): Temperatura máxima desejada.
     - `min_temp` (float): Temperatura mínima desejada.
     - `raio_busca` (float): Raio de busca em quilômetros (máximo de 200 km).
     - `offset` (int, opcional): Deslocamento para paginação dos resultados.

2. **Gerar Recomendação de Roteiro**:
   - Endpoint: `/recomendacao`
   - Método: `POST`
   - Descrição: Gera um roteiro de viagem baseado em uma lista de cidades fornecidas.
   - Parâmetros:
     - `cidades` (array): Lista de objetos contendo informações das cidades.

## Tecnologias Utilizadas

- **Node.js**: Plataforma de desenvolvimento em JavaScript no lado do servidor.
- **Express**: Framework para Node.js, utilizado para criação de servidores HTTP.
- **Axios**: Biblioteca para realizar requisições HTTP.
- **NodeCache**: Biblioteca de caching em memória para Node.js, utilizada para armazenar temporariamente os dados das APIs.
- **dotenv**: Biblioteca para carregar variáveis de ambiente a partir de um arquivo `.env`.
- **HTTPS**: Servidor HTTPS utilizando certificados SSL para segurança nas requisições.

## Estrutura do Projeto

```plaintext
.
├── CidadesRepositorio.js
├── RoteirosRepositorio.js
├── server.js
├── .env
├── package.json
├── key.pem
└── cert.pem
```

### Arquivos

- **CidadesRepositorio.js**: Contém a lógica para interagir com as APIs GeoDB e OpenWeather, além de funções para processar e filtrar os dados.
- **RoteirosRepositorio.js**: Contém a lógica para gerar roteiros de viagem (não detalhado neste documento).
- **index.js**: Arquivo principal que configura o servidor Express, define os endpoints e inicia o servidor HTTPS.
- **.env**: Arquivo que armazena variáveis de ambiente, incluindo chaves de API.
- **key.pem** e **cert.pem**: Arquivos de chave privada e certificado SSL para configurar o servidor HTTPS.

## Instalação

### Pré-requisitos

- Node.js (versão 12 ou superior)
- NPM (gerenciador de pacotes do Node.js)

### Passos

1. Clone o repositório:
    ```bash
    git clone https://github.com/seu-usuario/cidades-roteiros.git
    cd cidades-roteiros
    ```

2. Instale as dependências:
    ```bash
    npm install
    ```

3. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:
    ```plaintext
    CLIMATE_API_KEY=sua-chave-de-api-openweathermap
    ```

4. Gere e coloque os arquivos `key.pem` e `cert.pem` na raiz do projeto para configurar o HTTPS.

5. Inicie o servidor:
    ```bash
    node server.js
    ```

## Uso

### Buscar Cidades Próximas

Faça uma requisição GET para `/cidades` com os parâmetros necessários. Exemplo:
```bash
curl "https://localhost:443/cidades?lat=-23.5505&lon=-46.6333&max_temp=30&min_temp=15&raio_busca=50"
```

### Gerar Recomendação de Roteiro

Faça uma requisição POST para `/recomendacao` com um corpo JSON contendo a lista de cidades. Exemplo:
```bash
curl -X POST https://localhost:443/recomendacao -H "Content-Type: application/json" -d '{
  "cidades": [
    { "nome": "São Paulo", "estado": "SP" },
    { "nome": "Rio de Janeiro", "estado": "RJ" }
  ]
}'
```
### Gerar roteiro com a resposta da busca de cidades próximas
Faça uma requisição POST para `/recomendacao` com um corpo JSON contendo a lista de cidades retornadas pela requisição GET de `/cidades`. Exemplo:
```bash
curl -X POST https://localhost:443/recomendacao -H "Content-Type: application/json" -d '{
    "cidades": [
        {
            "nome": "Ribeirão Pires",
            "estado": "São Paulo",
            "distancia": 29.23,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 18.2,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 15.8,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0.18,
                        "avgvis_km": 5.5,
                        "avghumidity": 92,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 86,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 23.4,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 18,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8.3,
                        "avghumidity": 81,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 15.8,
                        "avgtemp_c": 19.7,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 72,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 25.2,
                        "mintemp_c": 16.7,
                        "avgtemp_c": 20.1,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 71,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 16.5,
                        "avgtemp_c": 21.1,
                        "maxwind_kph": 9.7,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 62,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Rio Grande da Serra",
            "estado": "São Paulo",
            "distancia": 32.75,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 18.2,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 15.8,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0.18,
                        "avgvis_km": 5.5,
                        "avghumidity": 92,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 86,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 23.4,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 18,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8.3,
                        "avghumidity": 81,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 15.8,
                        "avgtemp_c": 19.7,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 72,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 25.2,
                        "mintemp_c": 16.7,
                        "avgtemp_c": 20.1,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 71,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 16.5,
                        "avgtemp_c": 21.1,
                        "maxwind_kph": 9.7,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 62,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Várzea Paulista",
            "estado": "São Paulo",
            "distancia": 42.22,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 22.9,
                        "mintemp_c": 14,
                        "avgtemp_c": 17.4,
                        "maxwind_kph": 11.5,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8.2,
                        "avghumidity": 79,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            "code": 1003
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 24.6,
                        "mintemp_c": 14.1,
                        "avgtemp_c": 18.5,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 7.7,
                        "avghumidity": 71,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 25.8,
                        "mintemp_c": 15,
                        "avgtemp_c": 19.4,
                        "maxwind_kph": 6.1,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 66,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 26.5,
                        "mintemp_c": 15.4,
                        "avgtemp_c": 19.8,
                        "maxwind_kph": 6.1,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 64,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 26.7,
                        "mintemp_c": 15.3,
                        "avgtemp_c": 20.1,
                        "maxwind_kph": 9.4,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 59,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Mogi das Cruzes",
            "estado": "São Paulo",
            "distancia": 46.03,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 21.4,
                        "mintemp_c": 13.7,
                        "avgtemp_c": 15.8,
                        "maxwind_kph": 7.9,
                        "totalprecip_mm": 0.09,
                        "avgvis_km": 3.8,
                        "avghumidity": 90,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 24.7,
                        "mintemp_c": 12.4,
                        "avgtemp_c": 16.9,
                        "maxwind_kph": 7.2,
                        "totalprecip_mm": 0,
                        "avgvis_km": 4.6,
                        "avghumidity": 84,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/119.png",
                            "code": 1006
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 25.7,
                        "mintemp_c": 12.5,
                        "avgtemp_c": 17.9,
                        "maxwind_kph": 5.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 7.3,
                        "avghumidity": 78,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 26.2,
                        "mintemp_c": 13.3,
                        "avgtemp_c": 18.3,
                        "maxwind_kph": 5.4,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 76,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 26.8,
                        "mintemp_c": 13.2,
                        "avgtemp_c": 18.6,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8.3,
                        "avghumidity": 74,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Jundiaí",
            "estado": "São Paulo",
            "distancia": 46.85,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 23.3,
                        "mintemp_c": 13.7,
                        "avgtemp_c": 17.5,
                        "maxwind_kph": 14,
                        "totalprecip_mm": 0,
                        "avgvis_km": 9.2,
                        "avghumidity": 78,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            "code": 1003
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 14.1,
                        "avgtemp_c": 18.3,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 7.7,
                        "avghumidity": 70,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 26,
                        "mintemp_c": 14.9,
                        "avgtemp_c": 19.4,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 67,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 26.7,
                        "mintemp_c": 15.4,
                        "avgtemp_c": 19.9,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 63,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 26.9,
                        "mintemp_c": 15.3,
                        "avgtemp_c": 20,
                        "maxwind_kph": 9.4,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 59,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Jundiaí",
            "estado": "São Paulo",
            "distancia": 47.46,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 23.3,
                        "mintemp_c": 13.7,
                        "avgtemp_c": 17.5,
                        "maxwind_kph": 14,
                        "totalprecip_mm": 0,
                        "avgvis_km": 9.2,
                        "avghumidity": 78,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            "code": 1003
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 14.1,
                        "avgtemp_c": 18.3,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 7.7,
                        "avghumidity": 70,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 26,
                        "mintemp_c": 14.9,
                        "avgtemp_c": 19.4,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 67,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 26.7,
                        "mintemp_c": 15.4,
                        "avgtemp_c": 19.9,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 63,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 26.9,
                        "mintemp_c": 15.3,
                        "avgtemp_c": 20,
                        "maxwind_kph": 9.4,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 59,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "São Vicente",
            "estado": "São Paulo",
            "distancia": 48.48,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 20.9,
                        "mintemp_c": 17.2,
                        "avgtemp_c": 18.6,
                        "maxwind_kph": 9,
                        "totalprecip_mm": 0.42,
                        "avgvis_km": 10,
                        "avghumidity": 87,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 89,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 22.5,
                        "mintemp_c": 16.9,
                        "avgtemp_c": 19.3,
                        "maxwind_kph": 7.9,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 83,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 23.4,
                        "mintemp_c": 18,
                        "avgtemp_c": 20.3,
                        "maxwind_kph": 7.2,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 79,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 23.7,
                        "mintemp_c": 18.7,
                        "avgtemp_c": 20.6,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 79,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 25,
                        "mintemp_c": 18.7,
                        "avgtemp_c": 21.4,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 72,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Santa Isabel",
            "estado": "São Paulo",
            "distancia": 49.9,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 20.9,
                        "mintemp_c": 13.7,
                        "avgtemp_c": 16.1,
                        "maxwind_kph": 7.9,
                        "totalprecip_mm": 0.12,
                        "avgvis_km": 5.1,
                        "avghumidity": 88,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 86,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 24.3,
                        "mintemp_c": 12.4,
                        "avgtemp_c": 16.8,
                        "maxwind_kph": 6.1,
                        "totalprecip_mm": 0,
                        "avgvis_km": 5.9,
                        "avghumidity": 83,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            "code": 1003
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 25.1,
                        "mintemp_c": 12.5,
                        "avgtemp_c": 17.6,
                        "maxwind_kph": 4.7,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8,
                        "avghumidity": 77,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 25.5,
                        "mintemp_c": 12.9,
                        "avgtemp_c": 17.9,
                        "maxwind_kph": 5.4,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 74,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 26.6,
                        "mintemp_c": 12.7,
                        "avgtemp_c": 18.3,
                        "maxwind_kph": 5.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 71,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "São Roque",
            "estado": "São Paulo",
            "distancia": 50.63,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 22.3,
                        "mintemp_c": 14,
                        "avgtemp_c": 16.9,
                        "maxwind_kph": 14,
                        "totalprecip_mm": 0.01,
                        "avgvis_km": 9.7,
                        "avghumidity": 80,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png",
                            "code": 1003
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 25.5,
                        "mintemp_c": 14.1,
                        "avgtemp_c": 18.5,
                        "maxwind_kph": 7.9,
                        "totalprecip_mm": 0,
                        "avgvis_km": 8.7,
                        "avghumidity": 74,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 26.5,
                        "mintemp_c": 15.1,
                        "avgtemp_c": 19.6,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 70,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 15.8,
                        "avgtemp_c": 20.2,
                        "maxwind_kph": 7.2,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 66,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 15.6,
                        "avgtemp_c": 20.5,
                        "maxwind_kph": 10.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 61,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        },
        {
            "nome": "Santos",
            "estado": "São Paulo",
            "distancia": 55.33,
            "previsaoDoTempo": [
                {
                    "date": "2024-06-05",
                    "date_epoch": 1717545600,
                    "day": {
                        "maxtemp_c": 21.1,
                        "mintemp_c": 16.8,
                        "avgtemp_c": 19,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0.39,
                        "avgvis_km": 10,
                        "avghumidity": 87,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 89,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png",
                            "code": 1063
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "date_epoch": 1717632000,
                    "day": {
                        "maxtemp_c": 23,
                        "mintemp_c": 16.3,
                        "avgtemp_c": 19.3,
                        "maxwind_kph": 7.6,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 83,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "date_epoch": 1717718400,
                    "day": {
                        "maxtemp_c": 23.9,
                        "mintemp_c": 17.3,
                        "avgtemp_c": 20.1,
                        "maxwind_kph": 6.8,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 79,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "date_epoch": 1717804800,
                    "day": {
                        "maxtemp_c": 24.2,
                        "mintemp_c": 18,
                        "avgtemp_c": 20.5,
                        "maxwind_kph": 7.9,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 78,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "date_epoch": 1717891200,
                    "day": {
                        "maxtemp_c": 25.4,
                        "mintemp_c": 17.9,
                        "avgtemp_c": 21.2,
                        "maxwind_kph": 8.3,
                        "totalprecip_mm": 0,
                        "avgvis_km": 10,
                        "avghumidity": 72,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png",
                            "code": 1000
                        }
                    }
                }
            ]
        }'
```

## Contribuição

1. Fork do repositório.
2. Crie uma branch para sua feature ou correção de bug (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`).
4. Push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

Para mais informações, consulte a documentação oficial das APIs utilizadas:
- [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities)
- [Weather API](https://www.weatherapi.com)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node)

Sinta-se à vontade para abrir issues para reportar bugs ou sugerir melhorias.

### TODO
- Upload de imagem docker no DockerHub.
- Deploy da API com docker, nginx e azure.
