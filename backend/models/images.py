from pydantic import BaseModel
from datetime import date

class Image(BaseModel):
    filename: str
    title: str
    mediums: str
    tags: str
    created: date

class ImageIn(Image):
    base_64: str
    
class ImageOut(Image):
    id: int
