#run the db_create sql to create the DB and the schema in the DB
#do this in a loop because the timing for when the SQL instance is ready is indeterminate
for i in {1..50};
do
    /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "$SA_PASSWORD" -d master -i db_create.sql
    if [ $? -eq 0 ]
    then
        echo "import-data.sh: db_create.sql completed"
        break
    else
        echo "import-data.sh: not ready yet..."
        sleep 1
    fi
done

#import the data from the csv file
/opt/mssql-tools/bin/bcp salvialocaldb01.dbo.Products in "/usr/src/Products.csv" -c -t"," -S localhost -U sa -P "$SA_PASSWORD"

