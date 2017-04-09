#include "database.h"
#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>
#include <time.h>
#define READ_INTERVAL   60 /* How often to read the sensor */
#define MAXTIMINGS	85
#define DHTPIN		7
#define OUTPUT_FILE	"tempoutput.txt"

int dht11_dat[5] = { 0, 0, 0, 0, 0 };
FILE *fp;

int read_dht11_dat()
{
	uint8_t laststate	= HIGH;
	uint8_t counter		= 0;
	uint8_t j		= 0, i;
	float	f; 
 	time_t rawtime;

	dht11_dat[0] = dht11_dat[1] = dht11_dat[2] = dht11_dat[3] = dht11_dat[4] = 0;
 
	pinMode( DHTPIN, OUTPUT );
	digitalWrite( DHTPIN, LOW );
	delay( 18 );
	digitalWrite( DHTPIN, HIGH );
	delayMicroseconds( 40 );
	pinMode( DHTPIN, INPUT );
 
	for ( i = 0; i < MAXTIMINGS; i++ )
	{
		counter = 0;
		while ( digitalRead( DHTPIN ) == laststate )
		{
			counter++;
			delayMicroseconds( 1 );
			if ( counter == 255 )
			{
				break;
			}
		}
		laststate = digitalRead( DHTPIN );
 
		if ( counter == 255 )
			break;
 
		if ( (i >= 4) && (i % 2 == 0) )
		{
			dht11_dat[j / 8] <<= 1;
			if ( counter > 16 )
				dht11_dat[j / 8] |= 1;
			j++;
		}
	}
 
	if ( (j >= 40) &&
	     (dht11_dat[4] == ( (dht11_dat[0] + dht11_dat[1] + dht11_dat[2] + dht11_dat[3]) & 0xFF) ) )
	{
		f = dht11_dat[2] * 9. / 5. + 32;
		/* printf( "Humidity = %d.%d %% Temperature = %d.%d C (%.1f F)\n",
			dht11_dat[0], dht11_dat[1], dht11_dat[2], dht11_dat[3], f ); */
		time(&rawtime);

		float temperature = (float)(dht11_dat[2]) + (float)(dht11_dat[3])/10;
		float humidity = (float)(dht11_dat[0]) + (float)(dht11_dat[1])/10;
		int write_err = write_climate_to_database(rawtime, temperature, humidity);
/*
		fp = fopen(OUTPUT_FILE, "a");
		fprintf(fp, "%d,%d.%d,%d.%d\n", rawtime, dht11_dat[0], dht11_dat[1], dht11_dat[2], dht11_dat[3]);
		fclose(fp);
*/
		return 0;
	}else  {
		return 1;
		/* printf( "Data not good, skip\n" );*/
	}
}
 
int main( void )
{
	printf( "Raspberry Pi wiringPi DHT11 Temperature test program\n" );
 	int count;
	if ( wiringPiSetup() == -1 )
		exit( 1 );
 
 	/* Set up database connection */
	if (init_db_connection() == 1)
	{
		exit(1);
	}

	while ( 1 )
	{
		count = 0;
		while (read_dht11_dat() && count < 10) /* Keep trying until successful read up to 10 times */
		{
			count++;
		}
		delay( 1000*READ_INTERVAL ); /* Note this sometimes leads to a second being missed since the total loop time is 1 second + a tiny bit */
	}
 
	return(0);
}
