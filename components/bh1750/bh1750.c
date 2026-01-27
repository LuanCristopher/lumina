#include "bh1750.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"

static const char *TAG = "BH1750_DRIVER";

// Função para registrar o dispositivo no barramento I2C
esp_err_t bh1750_init(i2c_master_bus_handle_t bus_handle, i2c_master_dev_handle_t *dev_handle) {
    i2c_device_config_t dev_cfg = {
        .device_address = BH1750_ADDR,
        .scl_speed_hz = 100000, // 100kHz é seguro para este sensor
    };

    esp_err_t err = i2c_master_bus_add_device(bus_handle, &dev_cfg, dev_handle);
    if (err != ESP_OK) {
        ESP_LOGE(TAG, "Falha ao adicionar BH1750 ao barramento");
        return err;
    }

    // Opcional: Enviar comando de Power On
    uint8_t pwr_on = 0x01;
    return i2c_master_transmit(*dev_handle, &pwr_on, 1, -1);
}

esp_err_t bh1750_read_lux(i2c_master_dev_handle_t dev_handle, float *lux) {
    uint8_t cmd = 0x10; // Continuos High Res Mode
    uint8_t data[2];
    
    // Envia o comando para iniciar a medição
    esp_err_t err = i2c_master_transmit(dev_handle, &cmd, 1, -1);
    if (err != ESP_OK) return err;

    // O sensor precisa de tempo para processar (High Res costuma levar 120ms-180ms)
    vTaskDelay(pdMS_TO_TICKS(180)); 
    
    // Lê os 2 bytes de dados
    err = i2c_master_receive(dev_handle, data, 2, -1);
    if (err == ESP_OK) {
        uint16_t raw = (data[0] << 8) | data[1];
        *lux = raw / 1.2f; // Fórmula padrão do datasheet
    }
    return err;
}