#include "ina219.h"
#include "esp_log.h"

//static const char *TAG = "INA219_DRIVER";

esp_err_t ina219_init(i2c_master_bus_handle_t bus_handle, i2c_master_dev_handle_t *dev_handle) {
    i2c_device_config_t dev_cfg = {
        .device_address = INA219_ADDR,
        .scl_speed_hz = 100000,
    };
    return i2c_master_bus_add_device(bus_handle, &dev_cfg, dev_handle);
}

esp_err_t ina219_get_voltage(i2c_master_dev_handle_t dev_handle, float *voltage) {
    uint8_t reg = 0x02; // Bus Voltage Register
    uint8_t data[2];
    
    esp_err_t err = i2c_master_transmit_receive(dev_handle, &reg, 1, data, 2, -1);
    if (err == ESP_OK) {
        int16_t raw = (data[0] << 8) | data[1];
        // O valor é armazenado nos bits 3-15. O LSB é 4mV.
        *voltage = (raw >> 3) * 0.004f;
    }
    return err;
}

esp_err_t ina219_get_current(i2c_master_dev_handle_t dev_handle, float *current_ma) {
    uint8_t reg = 0x01; // Shunt Voltage Register
    uint8_t data[2];
    
    esp_err_t err = i2c_master_transmit_receive(dev_handle, &reg, 1, data, 2, -1);
    if (err == ESP_OK) {
        int16_t raw = (data[0] << 8) | data[1];
        // Cálculo simplificado: LSB é 10uV. 
        // Para um resistor shunt padrão de 0.1 Ohm: Corrente = ShuntVoltage / 0.1
        *current_ma = raw * 0.1f; 
    }
    return err;
}