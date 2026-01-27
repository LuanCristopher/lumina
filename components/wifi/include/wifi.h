#ifndef WIFI_H
#define WIFI_H

#include "esp_err.h"

#define WIFI_SSID      "Nani!"
#define WIFI_PASS      "matheus7"
#define MAXIMUM_RETRY  5

void wifi_init_sta(void);

#endif