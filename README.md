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
            "nome": "Rio do Sul",
            "estado": "Santa Catarina",
            "distancia": 0.06,
            "previsaoDoTempo": [
                {
                    "data": "2024-06-03",
                    "temp_max": "23.55",
                    "temp_min": "16.27",
                    "chuva": true
                },
                {
                    "data": "2024-06-04",
                    "temp_max": "17.23",
                    "temp_min": "11.29",
                    "chuva": true
                },
                {
                    "data": "2024-06-05",
                    "temp_max": "20.96",
                    "temp_min": "9.98",
                    "chuva": false
                },
                {
                    "data": "2024-06-06",
                    "temp_max": "22.19",
                    "temp_min": "11.73",
                    "chuva": false
                },
                {
                    "data": "2024-06-07",
                    "temp_max": "24.05",
                    "temp_min": "12.25",
                    "chuva": false
                },
                {
                    "data": "2024-06-08",
                    "temp_max": "22.93",
                    "temp_min": "12.92",
                    "chuva": false
                }
            ]
        },
        {
            "nome": "Indaial",
            "estado": "Santa Catarina",
            "distancia": 53.86,
            "previsaoDoTempo": [
                {
                    "data": "2024-06-03",
                    "temp_max": "25.91",
                    "temp_min": "18.05",
                    "chuva": true
                },
                {
                    "data": "2024-06-04",
                    "temp_max": "19.03",
                    "temp_min": "13.27",
                    "chuva": true
                },
                {
                    "data": "2024-06-05",
                    "temp_max": "22.30",
                    "temp_min": "11.57",
                    "chuva": false
                },
                {
                    "data": "2024-06-06",
                    "temp_max": "24.84",
                    "temp_min": "13.50",
                    "chuva": false
                },
                {
                    "data": "2024-06-07",
                    "temp_max": "26.65",
                    "temp_min": "14.55",
                    "chuva": false
                },
                {
                    "data": "2024-06-08",
                    "temp_max": "26.10",
                    "temp_min": "15.36",
                    "chuva": false
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
