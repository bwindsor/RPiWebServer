#pragma once
int init_db_connection();
void close_db_connection();
int write_climate_to_database(int time, float temperature, float humidity, int light_level);