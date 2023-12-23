from .base import Query
from models.images import *

class ImageQuery(Query):
    table = "images"

    def get_image_file(self, image: ImageOut):
        try:
            pass
        except:
            return {"Error": "Could not find file."}

    def get_all_images(self):
        self.connect_db()
        cursor = self.db_con.cursor()

        query = f"""
            SELECT * FROM {self.table}
        """
        cursor.execute(query)
        res = cursor.fetchall()

        self.disconnect_db()

        all_images = []
        for image in res:
            _image = ImageOut(
                id=image[0],
                filename=image[1],
                title=image[2],
                tags=image[3],
                mediums=image[4],
                created=image[5]
            )
            all_images.append(_image)

        return all_images


    def get_some_images(self, queries: dict):
        self.connect_db()
        cursor = self.db_con.cursor()

        query = f"""
            SELECT * FROM {self.table} 
            WHERE id > -1
        """
        # this is scuffed and probably needs a rework.
        values = []
        for key in queries:
            value = queries[key]
            match key:
                case "title":
                    if value == "": break
                    query += " AND title LIKE %s"
                case "mediums":
                    if value == "":
                        query += " OR"
                        queries["mediums"] = queries["title"]
                        value = queries["title"]
                    else:
                        query += " AND"

                    if queries["mediums"] == "": break
                    query += " mediums LIKE %s"
                case "tags":
                    if value == "":
                        query += " OR"
                        queries["tags"] = queries["title"]
                        value = queries["title"]
                    else:
                        query += " AND"

                    if queries["tags"] == "": break
                    query += " tags LIKE %s"
                case "created":
                    if value == "": break
                    query += " AND created LIKE %s"

            values.append(f'%{value}%')


        cursor.execute(query, values)
        res = cursor.fetchall()
        self.disconnect_db()

        all_images = []
        for image in res:
            print(image)
            _image = ImageOut(
                id=image[0], 
                filename=image[1],
                title=image[2],
                tags=image[3],
                mediums=image[4],
                created=image[5]
            )
            all_images.append(_image)

        return all_images

    def post_image(self, image) -> ImageOut:
        self.connect_db()
        cursor = self.db_con.cursor()

        query = f"""
            INSERT INTO {self.table} (filename, title, tags, mediums, created)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            image.filename,
            image.title,
            image.tags,
            image.mediums,
            image.created
        )

        cursor.execute(query, values)
        self.db_con.commit()

        self.disconnect_db()
        return self.get_all_images()