from fastapi import FastAPI, Depends, HTTPException, status
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
    "http://localhost",
    "http://localhost:5500",
    "localhost:5500",
    "localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(images.router)