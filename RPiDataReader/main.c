#include <stdio.h>
#include <stdlib.h>
#include "database.h"

int main(int argc, char **argv)
{
    int init_err = init_db_connection();
    if (init_err)
    {
        exit(1);
    }
    int write_err = write_climate_to_database(1500000, 13, 95);
    if (write_err)
    {
        printf("Fail");
        exit(1);
    }
    else
    {
        printf("Written");
        exit(0);
    }
}