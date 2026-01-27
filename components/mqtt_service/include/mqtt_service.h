#ifndef MQTT_SERVICE_H
#define MQTT_SERVICE_H

#include "mqtt_client.h"

// Configurações do Broker
#define MQTT_BROKER_URL    "mqtts://3188c4ea526d450591ea244edd90f91e.s1.eu.hivemq.cloud"
#define MQTT_BROKER_PORT   8883
#define MQTT_USERNAME      "SEU_USUARIO"
#define MQTT_PASSWORD      "SUA_SENHA"
#define MQTT_TOPIC_DATA    "v1/solar/data"

void mqtt_app_start(void);
void mqtt_send_data(const char *topic, const char *data);

#endif