from routers import admin
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import images
import os

app = FastAPI(
    title="Doodle-Gallery",
    description="A website to share all of my doodles.",
    version="0.0.1",
    contact={
        "Name": "Craig Johnson",
        "email": "CraigJArt@gmail.com"
    }
)

origins = [
    "https://CraigJ.Art",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(admin.router)
app.include_router(images.router)
