from fastapi import FastAPI
from app.database import Base, engine
from app.routers import auth, services
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Nearby Services Finder")

app.include_router(auth.router)
app.include_router(services.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
