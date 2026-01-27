# Lumina - Monitoramento Solar Inteligente

O projeto Lumina é um sistema completo para monitoramento de placas solares, integrando IoT (ESP32), Backend (Node.js) e Frontend (React).

## Arquitetura

1.  **ESP32**: Coleta dados de tensão, corrente e luminosidade e envia para o HiveMQ Cloud via MQTT (TLS).
2.  **Backend**: Assina os dados do MQTT, calcula a potência, salva no MongoDB Atlas e expõe uma API REST protegida por JWT.
3.  **Frontend**: Interface em React para visualização de dados em tempo real, gráficos históricos e gerenciamento de alertas.

## Requisitos

-   Node.js v18+
-   Conta no MongoDB Atlas
-   Conta no HiveMQ Cloud (ou outro broker MQTT com suporte a TLS)

## Configuração

### Backend

1.  Entre na pasta `backend`:
    ```bash
    cd backend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    -   Copie `.env.example` para `.env`
    -   Preencha com suas credenciais do MongoDB e HiveMQ.
4.  Inicie o servidor:
    ```bash
    npm run dev
    ```

### Frontend

1.  Entre na pasta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Configure as variáveis de ambiente:
    -   Copie `.env.example` para `.env`
    -   Ajuste `VITE_API_URL` se necessário (padrão: http://localhost:5000/api).
4.  Inicie o app:
    ```bash
    npm run dev
    ```

### Modo de Demonstração (Sem Backend)

Se você quiser visualizar as telas do frontend sem precisar rodar o backend ou configurar o MongoDB:
1. No arquivo `frontend/.env`, defina:
   ```env
   VITE_USE_MOCK=true
   ```
2. Reinicie o servidor do frontend. Agora você pode fazer login com qualquer email/senha e verá dados de exemplo nos gráficos e tabelas.

## Regra de Alerta (Limpeza)

O sistema possui uma regra inteligente para detectar se a placa solar precisa de limpeza:
-   Se **Luminosidade >= 10.000 lux** AND **Potência <= 0.3W** por **3 leituras consecutivas**, um alerta do tipo `NEEDS_CLEANING` é gerado para o usuário.

## Estrutura do Projeto

-   `/backend`: API Express + Mongoose + MQTT Subscriber.
-   `/frontend`: App React Vite com Tailwind e Recharts.
-   `/main`: Código C++ para o ESP32 (ESP-IDF).
