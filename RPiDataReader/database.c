#include "environment.h"
#include "database.h"
#include <mysql.h>
#include <my_global.h>

MYSQL *con;

int init_db_connection()
{
	con = mysql_init(NULL);

	if (con == NULL) 
	{
		fprintf(stderr, "%s\n", mysql_error(con));
		return 1;
	}

	if (mysql_real_connect(con, DB_HOST, DB_USER, DB_PASS, 
		CLIMATE_DB_NAME, 0, NULL, 0) == NULL)
	{
		fprintf(stderr, "%s\n", mysql_error(con));
		mysql_close(con);
		return 1;
	}
	return 0;
}

void close_db_connection()
{
	mysql_close(con);
}

int write_climate_to_database(int time, float temperature, float humidity, int light)
{
	char q[100];
	sprintf(q, "INSERT INTO climate VALUES (FROM_UNIXTIME(%d), %.1f, %.1f, %d);", time, temperature, humidity, light);
	if (mysql_query(con, q)) 
	{
		fprintf(stderr, "%s\n", mysql_error(con));
		return 1;
		/*mysql_close(con);
		/exit(1);*/
	}
	return 0;
}