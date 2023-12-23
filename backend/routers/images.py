import os
import fnmatch
import base64

from typing import Annotated

from fastapi import (APIRouter, Depends, Query)
from queries.images import ImageQuery
from models.images import *

router = APIRouter(tags=["IMAGES"])

@router.get("/api/images/image_file")
async def get_image_file(
    ImageOut
):
    pass

@router.get("/api/images/")
async def get_all_images(
        title: str | None =  None,
        mediums: str | None = None,
        tags: str | None = None,
        created: str | None = None,
        repo: ImageQuery = Depends()
    ):

    if (title or mediums or tags or created):
        if title == None: title = ""
        if created == None: created = ""
        if mediums == None: mediums = ""
        if tags == None: tags = ""
        
        search = {
            "title": title,
            "mediums": mediums,
            "tags": tags,
            "created": created
        }

        return repo.get_some_images(search)
    return repo.get_all_images()


@router.post("/api/images/")
async def post_image(image: ImageIn, repo: ImageQuery = Depends()):
    extensions = ("*.jpg", "*.jpeg", "*.png")
    save_local = os.environ.get("Image_Repo")

    repo.post_image(image)

    split = image.base_64.split(",")
    file_type, base_64 = split[0].split(";")[0].split("/")[1], split[1]
    base_64 = base_64.encode("ascii") 
    base_64 = base64.b64encode(base_64)

    print(file_type)

    count = 0
    for extension in extensions:
        if fnmatch.fnmatch(save_local, extension):
            count += 1

    with open(str(count) + f".{file_type}", "wb") as f:
        f.write(base64.decodebytes(base_64))