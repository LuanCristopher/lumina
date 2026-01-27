#include <stdio.h>
#include "esp_log.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/i2c_master.h"
#include "nvs_flash.h"
#include "cJSON.h"

// Inclusão dos componentes customizados
#include "ina219.h"
#include "bh1750.h"
#include "wifi.h"
#include "mqtt_service.h"

// Definições dos pinos
#define I2C_SDA_PIN  21
#define I2C_SCL_PIN  22

static const char *TAG = "SOLAR_MONITOR";

void app_main(void){
    // 1. Inicializa a NVS (Necessário para o Wi-Fi)
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // 2. Inicializa o Wi-Fi
    wifi_init_sta();

    // 3. Inicia o cliente MQTT
    mqtt_app_start();

    // 4. Configuração do Barramento (Bus)
    i2c_master_bus_config_t bus_config = {
        .clk_source = I2C_CLK_SRC_DEFAULT,
        .i2c_port = I2C_NUM_0,
        .scl_io_num = I2C_SCL_PIN,
        .sda_io_num = I2C_SDA_PIN,
        .glitch_ignore_cnt = 7,
        .flags.enable_internal_pullup = true,
    };

    i2c_master_bus_handle_t bus_handle;
    ESP_ERROR_CHECK(i2c_new_master_bus(&bus_config, &bus_handle));

    ESP_LOGI(TAG, "I2C inicializado com sucesso!");

    // 5. Handles dos dispositivos
    i2c_master_dev_handle_t ina_handle;
    i2c_master_dev_handle_t bh_handle;

    // 6. Inicializa os sensores (as funções que criamos nos componentes)
    bool ina_ok = (ina219_init(bus_handle, &ina_handle) == ESP_OK);
    if (!ina_ok) {
        ESP_LOGE(TAG, "Falha ao inicializar INA219");
    }
    
    bool bh_ok = (bh1750_init(bus_handle, &bh_handle) == ESP_OK);
    if (!bh_ok) {
        ESP_LOGE(TAG, "Falha ao inicializar BH1750");
    }

    while (1) {
        float voltagem = 0, corrente_ma = 0, lux = 0;

        // Leitura do INA219 (Apenas se inicializado)
        if (ina_ok && ina_handle != NULL) {
            if (ina219_get_voltage(ina_handle, &voltagem) != ESP_OK) {
                ESP_LOGW(TAG, "Erro ao ler voltagem do INA219");
            }
            ina219_get_current(ina_handle, &corrente_ma);
        }

        // Leitura do BH1750 (Apenas se inicializado)
        if (bh_ok && bh_handle != NULL) {
            if (bh1750_read_lux(bh_handle, &lux) != ESP_OK) {
                ESP_LOGW(TAG, "Erro ao ler lux do BH1750");
            }
        }

        // Emcapsulamento JSON
        cJSON *root = cJSON_CreateObject();
        cJSON_AddStringToObject(root, "device_id", "lumina_esp32_01");
        cJSON_AddNumberToObject(root, "tensao_v", voltagem);
        cJSON_AddNumberToObject(root, "corrente_ma", corrente_ma);
        cJSON_AddNumberToObject(root, "luminosidade_lux", lux);

        char *json_data = cJSON_PrintUnformatted(root);

        if (json_data != NULL) {
            mqtt_send_data(MQTT_TOPIC_DATA, json_data);
            ESP_LOGI(TAG, "JSON Enviado: %s", json_data);
            free(json_data);
        }

        cJSON_Delete(root);
        printf("--------------------------------------------\n");
        vTaskDelay(pdMS_TO_TICKS(10000));
    }
}