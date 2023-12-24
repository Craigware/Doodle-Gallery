import mysql.connector
import os

class Query:
    db = "gallerydb"

    def connect_db(self):
        self.db_con = mysql.connector.connect(
            username="craig",
            password=os.environ.get("SQL_PASS"),
            database="gallerydb"
        )

        return self.db_con
    
    def disconnect_db(self):
        self.db_con.disconnect()
        return True
