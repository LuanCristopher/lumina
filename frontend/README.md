# Lumina Frontend

O frontend do Lumina é uma aplicação web moderna construída com **React 19** e **Vite 7**, projetada para monitorar a produção de energia solar em tempo real. A interface foca em clareza, desempenho e visualização de dados eficiente.

## 🚀 Tecnologias Utilizadas

- **React 19**: Biblioteca principal para construção da interface.
- **Vite 7**: Ferramenta de build e servidor de desenvolvimento ultra-rápido.
- **Tailwind CSS 4**: Framework CSS utility-first para estilização moderna e responsiva.
- **Recharts**: Biblioteca de gráficos para visualização das leituras de potência e luminosidade.
- **Lucide React**: Conjunto de ícones consistentes e bonitos.
- **React Router Dom 7**: Gerenciamento de rotas e navegação SPA.
- **Axios**: Cliente HTTP para comunicação com a API do backend.
- **Context API**: Gerenciamento de estado global (autenticação).

---

## 📁 Estrutura de Pastas

A organização do código segue o padrão de subdiretórios dentro de `src/`:

- **`api/`**: Configuração do Axios e instâncias de API.
- **`assets/`**: Recursos estáticos como imagens e SVGs.
- **`components/`**: Componentes reutilizáveis (Ex: Layout, ProtectedRoute).
- **`context/`**: Contextos globais (Ex: AuthContext).
- **`pages/`**: Páginas principais da aplicação.
- **`utils/`**: Funções utilitárias (Ex: formatPower).

## 🛣️ Rotas da Aplicação

As rotas são gerenciadas no `App.jsx` e protegidas por autenticação onde necessário:

- **`/login`**: Página de acesso ao sistema.
- **`/register`**: Cadastro de novos usuários.
- **`/devices`**: Listagem de todas as placas solares registradas (Protegida).
- **`/devices/:id`**: Dashboard detalhado de uma placa específica (Protegida).
- **`/alerts`**: Gerenciamento de alertas de limpeza e manutenção (Protegida).

---

## 📄 Páginas e Funcionalidades

### 🔐 Autenticação (Login e Cadastro)
As páginas de `Login.jsx` e `Register.jsx` utilizam o `AuthContext` para gerenciar a sessão do usuário.
- **`handleSubmit`**: Valida os campos e chama as funções de `login` ou `register` da API. Em caso de sucesso, redireciona para a lista de dispositivos.

### 📋 Minhas Placas (Devices)
Exibe todos os dispositivos vinculados à conta do usuário.
- **`fetchDevices`**: Busca a lista de dispositivos no backend ao carregar a página.
- **`handleAddDevice`**: Abre um modal para cadastrar uma nova placa solar utilizando um `deviceId` único e um nome amigável.

### 🔔 Alertas (Alerts)
Lista problemas detectados, como a necessidade de limpeza das placas.
- **`fetchAlerts`**: Recupera alertas filtrados por status (Abertos, Resolvidos ou Todos).
- **`handleResolve`**: Permite marcar um alerta como resolvido manualmente.

---

## 📊 Dashboard de Dispositivo (DeviceDashboard)

O Dashboard é o coração da aplicação, fornecendo dados em tempo real e visualizações históricas.

### ⏱️ Atualização em Tempo Real
- A página utiliza a função **`fetchData`** para buscar dados de três endpoints simultaneamente (`devices`, `readings` e `stats`).
- Implementa um mecanismo de **polling de 10 segundos** utilizando `setInterval`, garantindo que os dados na tela estejam sempre atualizados sem a necessidade de recarregar a página.

### 📈 Comportamento do Gráfico
O gráfico utiliza a biblioteca **Recharts** para plotar a evolução temporal dos dados:
- **Eixo X**: Tempo das leituras (HH:mm:ss).
- **Linha Amarela (Potência)**: Representa a potência gerada em Watts. Utiliza a função `formatPower` para exibir valores amigáveis no tooltip.
- **Linha Laranja Tracejada (Luminosidade)**: Representa a luminosidade captada.
    - **Escalonamento**: Para que os valores de luminosidade (que podem chegar a 60.000+ lux) sejam visualmente comparáveis com a potência (geralmente < 50W), os valores de lux são **divididos por 1.000** no gráfico.
- **Tooltip Customizado**: Ao passar o mouse, o gráfico exibe os valores exatos formatados.

### 🗠 Estatísticas e Cards
- **Cards de Resumo**: Exibem os valores instantâneos de Potência, Tensão (V), Corrente (mA) e Luminosidade (lx).
- **Comparação Histórica**: A seção de estatísticas compara a potência atual com a **média de produção dos últimos 2 dias** (filtrada para períodos de alta luminosidade > 15k lux).
    - Exibe um indicador visual (**Acima da média** ou **Abaixo da média**) para ajudar o usuário a identificar quedas anômalas de desempenho.

---

## 🛠️ Utilidades e Contexto

### `AuthContext.jsx`
Gerencia o estado global de autenticação utilizando a Context API do React.
- **`login(email, password)`**: Autentica o usuário e armazena os dados no `localStorage`.
- **`register(email, password)`**: Cria uma nova conta e inicia a sessão.
- **`logout()`**: Limpa o `localStorage` e encerra a sessão.

### `formatPower.js`
Função utilitária crucial para a legibilidade dos dados de potência:
- **Clamping**: Garante que valores negativos sejam exibidos como 0.
- **Redução de Ruído**: Valores abaixo de 0.5mW são ignorados (exibidos como "0.0 mW").
- **Escalonamento Automático**:
    - Se < 1W: Exibe em **milliWatts (mW)**.
    - Se >= 1W: Exibe em **Watts (W)**.
- **Precisão Dinâmica**: Ajusta as casas decimais para melhor leitura (ex: 1.25W vs 15.2W).

---

## 🛠️ Como Executar o Projeto

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar Variáveis de Ambiente**:
   Crie um arquivo `.env` baseado no `.env.example`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Executar em Modo de Desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Gerar Build de Produção**:
   ```bash
   npm run build
   ```
