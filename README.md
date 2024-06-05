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
                    "day": {
                        "maxtemp_c": 18.2,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 15.8,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 86,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png"
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "day": {
                        "maxtemp_c": 23.4,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 18,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 15.8,
                        "avgtemp_c": 19.7,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "day": {
                        "maxtemp_c": 25.2,
                        "mintemp_c": 16.7,
                        "avgtemp_c": 20.1,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 16.5,
                        "avgtemp_c": 21.1,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
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
                    "day": {
                        "maxtemp_c": 18.2,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 15.8,
                        "daily_will_it_rain": 1,
                        "daily_chance_of_rain": 86,
                        "condition": {
                            "text": "Possibilidade de chuva irregular",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/176.png"
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "day": {
                        "maxtemp_c": 23.4,
                        "mintemp_c": 14.5,
                        "avgtemp_c": 18,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "day": {
                        "maxtemp_c": 24.8,
                        "mintemp_c": 15.8,
                        "avgtemp_c": 19.7,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "day": {
                        "maxtemp_c": 25.2,
                        "mintemp_c": 16.7,
                        "avgtemp_c": 20.1,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "day": {
                        "maxtemp_c": 27,
                        "mintemp_c": 16.5,
                        "avgtemp_c": 21.1,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
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
                    "day": {
                        "maxtemp_c": 22.9,
                        "mintemp_c": 14,
                        "avgtemp_c": 17.4,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Parcialmente nublado",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/116.png"
                        }
                    }
                },
                {
                    "date": "2024-06-06",
                    "day": {
                        "maxtemp_c": 24.6,
                        "mintemp_c": 14.1,
                        "avgtemp_c": 18.5,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-07",
                    "day": {
                        "maxtemp_c": 25.8,
                        "mintemp_c": 15,
                        "avgtemp_c": 19.4,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-08",
                    "day": {
                        "maxtemp_c": 26.5,
                        "mintemp_c": 15.4,
                        "avgtemp_c": 19.8,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                },
                {
                    "date": "2024-06-09",
                    "day": {
                        "maxtemp_c": 26.7,
                        "mintemp_c": 15.3,
                        "avgtemp_c": 20.1,
                        "daily_will_it_rain": 0,
                        "daily_chance_of_rain": 0,
                        "condition": {
                            "text": "Sol",
                            "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
                        }
                    }
                }
            ]
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
