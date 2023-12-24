from pydantic import BaseModel

class Image(BaseModel):
    filename: str
    title: str
    mediums: str
    tags: str
    created: str

class ImageIn(Image):
    base_64: str
    
class ImageOut(Image):
    id: int
