#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>
#include "database.h"
#include "dht11.h"
#include "lightread.h"

#define READ_INTERVAL  60 /* How often to read the sensors */

int main(int argc, char **argv)
{
/*	printf( "Raspberry Pi wiringPi DHT11 Temperature test program\n" ); */
 	int count;
	int light_level;
	dht11_data_t dht11_data;
	
	/* Set up wiring pi */
	if ( wiringPiSetup() == -1 )
		exit( 1 );
    /* Set up light sensor read */
    light_read_setup();
 
 	/* Set up database connection */
	if (init_db_connection() == 1)
	{
		exit(1);
	}

	while ( 1 )
	{
		count = 0;
		/* Read dht11 temperature and humidity */
		while (read_dht11_dat(&dht11_data) && count < 10) /* Keep trying until successful read up to 10 times */
		{
			count++;
		}
		/* Read light sensor */
		read_light_level(&light_level);

        /* Write results to database */
		int write_err = write_climate_to_database(dht11_data.rawtime, dht11_data.temperature, dht11_data.humidity, light_level);
		
		/* Wait to do the next read */
		delay( 1000*READ_INTERVAL ); /* Note this sometimes leads to a second being missed since the total loop time is 1 second + a tiny bit */
	}
 
	return(0);
}
