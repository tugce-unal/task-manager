from pydantic import BaseModel
from typing import Optional

class TaskCreate(BaseModel):
    title : str 
    description : Optional[str] = "" 
    status : Optional[str] = "todo"

class TaskUpdate(BaseModel):
    title : Optional[str] = None
    description : Optional[str] = None 
    status : Optional[str] = None

class TaskResponse(BaseModel):
    id : int 
    title : str 
    description : str 
    status : str 
    owner_id : int 

    class Config:
        from_attributes = True