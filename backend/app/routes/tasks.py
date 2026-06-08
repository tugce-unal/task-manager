from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from typing import List
from jose import jwt, JWTError
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/tasks", tags=["tasks"])

SECRET_KEY = ""
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/auth/login")

def get_currect_user_id(token : str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Geçersiz Token")
    


@router.get("/", response_model=List[TaskResponse])
def get_tasks(db: Session = Depends(get_db), user_id: int = Depends(get_currect_user_id)):
    return db.query(Task).filter(Task.owner_id == user_id).all()

@router.post("/", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), user_id: int = Depends(get_currect_user_id)):
    new_task = Task(**task.dict(), owner_id=user_id)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


@router.patch("/{task_id}", response_model= TaskResponse)
def update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db, ), user_id: int = Depends(get_currect_user_id)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail= "Task Bulunamadı!")
    for key, value in task.dict(exclude_none= True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user_id: int = Depends(get_currect_user_id)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.owner_id == user_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail= "Task Bulunamadı!")
    db.delete(db_task)
    db.commit()
    return {"message": "Task silindi."}