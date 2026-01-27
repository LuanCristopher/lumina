#ifndef INA219_H
#define INA219_H

#include "driver/i2c_master.h"

#define INA219_ADDR 0x40

// Funções para o INA219
esp_err_t ina219_init(i2c_master_bus_handle_t bus_handle, i2c_master_dev_handle_t *dev_handle);
esp_err_t ina219_get_voltage(i2c_master_dev_handle_t dev_handle, float *voltage);
esp_err_t ina219_get_current(i2c_master_dev_handle_t dev_handle, float *current_ma);

#endif