#include <time.h>

typedef struct {
    float temperature;
    float humidity;
    time_t rawtime;
} dht11_data_t;

int read_dht11_dat(dht11_data_t *dht11_data);