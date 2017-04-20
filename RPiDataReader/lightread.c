#include "lightread.h"
#include <wiringPi.h>
#include <mcp3004.h>

#define PIN_BASE 100
#define SPI_CHAN 0
#define LIGHT_CHAN 0

void light_read_setup(void)
{
    wiringPiSetup();
    mcp3004Setup (PIN_BASE, SPI_CHAN);
}

void read_light_level(int *light_level)
{
    *light_level = analogRead (PIN_BASE + LIGHT_CHAN);
}