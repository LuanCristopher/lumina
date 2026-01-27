#ifndef BH1750_H
#define BH1750_H

#include "driver/i2c_master.h"

#define BH1750_ADDR 0x23 // Endereço padrão (pode ser 0x5C se o pino ADDR estiver em nível alto)

esp_err_t bh1750_init(i2c_master_bus_handle_t bus_handle, i2c_master_dev_handle_t *dev_handle);
esp_err_t bh1750_read_lux(i2c_master_dev_handle_t dev_handle, float *lux);

#endif