import os

from typing import Annotated

from fastapi import (APIRouter, Depends, Header)
from fastapi.responses import FileResponse

from queries.images import ImageQuery
from models.images import *

router = APIRouter(tags=["IMAGES"])

@router.get("/api/images/{image_id}")
async def get_image_file(
    image_id: int,
    file: str | None = None,
    repo: ImageQuery = Depends()
):
    image = repo.get_one_image(image_id)
    if file:
        image_file = repo.get_image_file(image)
        return FileResponse(image_file)
    return image


@router.get("/api/images/")
async def get_all_images(
        title: str | None =  None,
        mediums: str | None = None,
        tags: str | None = None,
        created: str | None = None,
        sort_style: str | None = "default",
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
        images = repo.get_some_images(search)
        return repo.order_image_list(images, sort_style)
    
    images = repo.get_all_images()      

    if (sort_style):
        return repo.order_image_list(images, sort_style)
    else:
        return images


@router.post("/api/images/")
async def post_image(
    image: ImageIn,
    api_access_token: str = Header(..., convert_underscores=True),
    repo: ImageQuery = Depends()
):
    if (not api_access_token == os.environ.get("GALLERY_API_ACCESS_TOKEN")): return {"Error": "Invalid api token"}
    filename = repo.upload_image_file(image)
    if filename:
        return repo.post_image(image, filename)
    else:
        return {"Error": "Image failed to post."}