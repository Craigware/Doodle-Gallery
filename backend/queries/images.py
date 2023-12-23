import os
import base64
from fnmatch import fnmatch

from fastapi import UploadFile
from .base import Query
from models.images import *

class ImageQuery(Query):
    table = "images"
    image_repo = os.environ.get("Image_Repo")

    def get_image_file(self, image: ImageOut) -> str | dict:
        local = self.image_repo + image.filename
        if os.path.isfile(local):
            return local
        return {"Error": "Could not find file."}
    

    def upload_image_file(self, image: ImageIn) -> bool:
        extensions = ("jpg", "jpeg", "png")
        base_64 = image.base_64
        split = base_64.split(",")
        file_type, base_64 = split[0].split(";")[0].split("/")[1], split[1]

        if file_type in extensions:
            base_64 = base64.b64decode(base_64)

            count = 0
            for extension in extensions:
                for file in os.listdir(self.image_repo):
                    if fnmatch(file, "*." + extension): count += 1

            filename = f"image_{count}" + "." + file_type
            with open(self.image_repo + filename, "wb") as f:
                f.write(base_64)
            
            return filename
        return False
        

    def get_one_image(self, image_id) -> ImageOut | dict:
        self.connect_db()
        cursor = self.db_con.cursor()

        query = f"""
            SELECT * FROM {self.table} WHERE id = %s
        """
        cursor.execute(query, [image_id])
        res = cursor.fetchone()

        self.disconnect_db()
        if res != None:
            image = ImageOut(
                id=res[0],
                filename=res[1],
                title=res[2],
                mediums=res[3],
                tags=res[4],
                created=res[5]
            )
            return image
        else: 
            return {"Error": f"Image of id {image_id} not found."}


    def get_all_images(self) -> list:
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
                mediums=image[3],
                tags=image[4],
                created=image[5]
            )
            all_images.append(_image)

        return all_images


    def get_some_images(self, queries: dict) -> list:
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
                mediums=image[3],
                tags=image[4],
                created=image[5]
            )
            all_images.append(_image)

        return all_images


    def post_image(self, image, filename) -> ImageOut:
        self.connect_db()
        cursor = self.db_con.cursor()

        query = f"""
            INSERT INTO {self.table} (filename, title, tags, mediums, created)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (
            filename,
            image.title,
            image.tags,
            image.mediums,
            image.created
        )

        cursor.execute(query, values)
        self.db_con.commit()

        self.disconnect_db()
        return self.get_all_images()