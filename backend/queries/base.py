import mysql.connector
import os

class Query:
    db = "gallerydb"

    def connect_db(self):
        self.db_con = mysql.connector.connect(
            host="gallerydb",
            password=os.environ.get("MYSQL_ROOT_PASSWORD"),
            database=os.environ.get("MYSQL_DATABASE")
        )

        return self.db_con
    
    def disconnect_db(self):
        self.db_con.disconnect()
        return True
