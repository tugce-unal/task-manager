from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import auth, tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(title = "Task Manager API")

#app.add_middleware(
#    CORSMiddleware,
#    allow_origins = ["https://localhost:5173"],
#    allow_credentials = True,
#    allow_methods = ["*"],
#    allow_headers = ["*"],
#)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/")
def root():
    return {"message": "Task Manager API çalışıyor!"}