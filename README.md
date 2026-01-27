# Lumina - Monitoramento de Energia Solar com ESP32

Este projeto realiza a medição de luminosidade e produção de energia de um painel solar de 6V/1W utilizando um ESP32 e sensores via barramento I2C.

---

## 🛠️ Hardware Necessário
* **ESP-32** (30 ou 38 pinos)
* **Sensor de Luz BH1750**
* **Sensor de Corrente e Tensão INA219**
* **Painel Solar:** 6V 1W 200mA (110x60mm)
* **Carga para Teste:** Resistor de Potência (Sugestão: 33 $\Omega$ / 5W) ou uma bateria com controlador de carga.

---

## 🔌 Esquema de Conexões

### 1. Barramento de Dados (I2C)
Ambos os sensores compartilham os mesmos pinos de dados do ESP32.

| Componente | Pino Sensor | Pino ESP32 | Cor do Fio (Sugestão) |
| :--- | :--- | :--- | :--- |
| **BH1750** | VCC | 3.3V | Vermelho |
| **BH1750** | GND | GND | Preto |
| **BH1750** | SDA | GPIO 21 | Azul |
| **BH1750** | SCL | GPIO 22 | Amarelo |
| **INA219** | VCC | 3.3V | Vermelho |
| **INA219** | GND | GND | Preto |
| **INA219** | SDA | GPIO 21 | Azul |
| **INA219** | SCL | GPIO 22 | Amarelo |

### 2. Circuito de Medição de Energia (Painel Solar)
Para medir a corrente, o INA219 deve ser conectado entre o painel e a carga (High-Side Sensing).

1.  **Painel Solar (+)** -> Conectar no terminal **Vin+** do INA219.
2.  **Vin- do INA219** -> Conectar no **Positivo (+)** da Carga (ex: Resistor ou Bateria).
3.  **Painel Solar (-)** -> Conectar no **GND do ESP32** e no **Negativo (-)** da Carga.

> [!IMPORTANT]
> O GND do painel solar **precisa** estar unido ao GND do ESP32 para que a medição de tensão tenha uma referência comum.

---

## 🌐 Conectividade Wi-Fi
O projeto utiliza o modo **Station (STA)** para se conectar à internet.

* **Método:** Hotspot Móvel (celular) para contornar restrições de redes institucionais.
* **Rede Configurada:** `Nani!` Definida em `wifi.h`
* **Gerenciamento:** Event-driven utilizando o ESP-IDF Event Loop para reconexão automática.

> [!NOTE]
> As credenciais de Wi-Fi estão centralizadas em `components/wifi/include/wifi.h`.

## 📡 Integração MQTT
A comunicação com a nuvem está implementada via protocolo seguro (TLS) utilizando o broker **HiveMQ Cloud**.

* **Broker:** `3188c4ea526d450591ea244edd90f91e.s1.eu.hivemq.cloud`
* **Porta:** 8883 (TLS/SSL)
* **Tópico de Publicação:** `v1/solar/data`
* **Formato de Dados:** JSON (Serializado via cJSON)

#### 📝 Exemplo de Payload (Enviado a cada 10s):
```json
{
  "device_id": "lumina_esp32_01",
  "tensao_v": 5.82,
  "corrente_ma": 145.5,
  "luminosidade_lux": 12500.0
}
```

---

## 💻 Configuração do Ambiente

Este projeto foi desenvolvido utilizando o **ESP-IDF v5.x** no VS Code.

### Passos para Compilar:
1.  Certifique-se de ter a extensão **Espressif IDF** instalada no VS Code.
2.  Selecione o target do chip:
    ```bash
    idf.py set-target esp32
    ```
3.  Compile o projeto:
    ```bash
    idf.py build
    ```
4.  Grave no ESP32:
    ```bash
    idf.py -p [PORTA_COM] flash monitor
    ```

---

## 📂 Estrutura de Componentes
O projeto segue uma arquitetura modularizada:
* `bh1750`: Driver para leitura de intensidade luminosa (Lux).
* `ina219`: Driver para leitura de energia (Tensão e Corrente).
* `wifi`: Gerenciador de conexão e eventos de rede.
* `mqtt_service`: Serviço de mensageria segura (TLS) e abstração do protocolo MQTT.

---

## 📝 Notas de Implementação
* **Endereço I2C BH1750:** O pino ADDR deve estar aterrado (GND) para o endereço `0x23`.
* **Resistores Pull-up:** O código utiliza o pull-up interno do ESP32. Se houver falha de comunicação, adicione resistores externos de $4.7k\Omega$ nas linhas SDA e SCL ligadas ao 3.3V.
* **json (cJSON):** Biblioteca nativa do ESP-IDF utilizada para serialização dos dados.
* **Segurança:** O projeto utiliza TLS para criptografia dos dados em trânsito.
* **Estabilidade:** Implementada limpeza rigorosa de memória com `cJSON_Delete` e `free()` para garantir operação 24/7 