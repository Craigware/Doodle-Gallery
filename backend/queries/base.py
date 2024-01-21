import mysql.connector
import os

def quick_sort_date(array):
    def partition(array, low, high):
        pivot = array[high]

        i = low - 1

        for j in range(low, high):
            if array[j].created <= pivot.created:
                i = i + 1
                (array[i], array[j]) = (array[j], array[i])
        
        (array[i+1], array[high]) = (array[high], array[i+1])

        return i + 1
    
    def sort(array, low, high):
        if low < high:
            pi = partition(array, low, high)
            sort(array, low, pi - 1)
            sort(array, pi + 1, high)

    sort(array, 0, len(array)-1)
    return array

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
