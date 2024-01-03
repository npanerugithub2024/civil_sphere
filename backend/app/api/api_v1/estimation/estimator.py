from fastapi import FastAPI, APIRouter , logger,HTTPException, Body, Depends
from pydantic import BaseModel, Field
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from collections import defaultdict
from pymongo.errors import DuplicateKeyError
from collections import defaultdict
from bson import ObjectId
from ..users.user_authentication import User, get_current_user



app = FastAPI()
router = APIRouter()

client = AsyncIOMotorClient("mongodb://mongodb:27018/")  # Note the hostname is 'mongodb' as defined in docker-compose file
database = client.estimation
specification_collection = database.specification_list
workdetails_collection = database.workdetails_list
project_collections = database.project  # Collection for projects
workitem_collection = database.workitems  # Collection for work items



class Item(BaseModel):
    name: str
    unitQuantity: str
    unit: str

class WorkSpecification(BaseModel):
    code: str
    description: Optional[str]
    unit: Optional[str]
    manpower: Optional[List[Item]]
    materials: Optional[List[Item]]
    miscellaneous: Optional[List[Item]]
    labour_rate: Optional[str]
    work_type: Optional[str]

class MaterialRate(BaseModel):
    item: str
    rate: float
    unit: Optional[str] = None

class BOQ(BaseModel):
    code: str
    quantity: float
    remarks: Optional[str] = None

class Project(BaseModel):
    project_id: Optional[str] = None
    name: str
    description: Optional[str] = None
    user_id: Optional[str] = None  # Add a field for the user ID



class WorkItemBase(BaseModel):
    # id: str = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    project_id: str  # Reference to the Project ID
    work_code: str
    work_type: str
    quantity: float
    unit: str
    details: Optional[str] = None
    remarks: Optional[str] = None
    # Additional fields as required for the work item

class WorkItemCreate(WorkItemBase):
    pass  # Ensure it doesn't have 'id' field but includes 'project_id'

class WorkItemUpdate(BaseModel):
    # Include fields that can be updated, excluding 'id' and 'project_id'
    work_code: Optional[str] = None
    work_type: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    details: Optional[str] = None
    remarks: Optional[str] = None


class WorkItemInDB(WorkItemBase):
    id: str  # MongoDB document ID


class InputData(BaseModel):
    code: str
    quantity: float
    remarks: Optional[str]

# just commenting out
@router.post("/add_bulk_work_specifications") 
async def add_bulk_work_specifications(specs_data: List[WorkSpecification]):
    # Convert Pydantic models to dictionaries
    documents = [spec.dict() for spec in specs_data]

    # Optional: Check for existing codes to avoid duplicates
    for doc in documents:
        existing_document = await specification_collection.find_one({"code": doc["code"]})
        if existing_document:
            raise HTTPException(status_code=400, detail=f"Document with code {doc['code']} already exists.")

    # Insert documents in bulk
    result = await specification_collection.insert_many(documents)

    if result.acknowledged:
        # Retrieve inserted documents, converting ObjectId to string
        inserted_documents = await specification_collection.find({"_id": {"$in": result.inserted_ids}}).to_list(None)
        for doc in inserted_documents:
            doc["_id"] = str(doc["_id"])
        return inserted_documents
    else:
        raise HTTPException(status_code=400, detail="Bulk insertion failed.")


@router.post("/add_work_specification")
async def add_work_specification(spec_data: WorkSpecification):
    document = spec_data.dict()
    existing_document = await specification_collection.find_one({"code": document["code"]})

    if existing_document:
        raise HTTPException(status_code=400, detail="Document with this code already exists.")

    result = await specification_collection.insert_one(document)
    if result.acknowledged:
        inserted_id = result.inserted_id
        document = await specification_collection.find_one({"_id": inserted_id})
        document["_id"] = str(document["_id"])
        return document
    else:
        raise HTTPException(status_code=400, detail="Insertion failed.")

@router.get("/work_specification/{code}", response_model=WorkSpecification)
async def read_work_specification(code: str):
    specification = await specification_collection.find_one({"code": code})
    if specification:
        return specification
    else:
        raise HTTPException(status_code=404, detail="Work Specification not found")

@router.put("/work_specification/{code}")
async def update_work_specification(code: str, spec_data: WorkSpecification = Body(...)):
    specification = await specification_collection.find_one({"code": code})
    if specification:
        updated_specification = await specification_collection.update_one(
            {"code": code}, {"$set": spec_data.dict()}
        )
        if updated_specification:
            return {"code": code, "message": "Work Specification updated"}
        else:
            raise HTTPException(status_code=400, detail="Work Specification update failed")
    else:
        raise HTTPException(status_code=404, detail="Work Specification not found")

@router.delete("/work_specification/{code}")
async def delete_work_specification(code: str):
    specification = await specification_collection.find_one({"code": code})
    if specification:
        await specification_collection.delete_one({"code": code})
        return {"code": code, "message": "Work Specification deleted"}
    else:
        raise HTTPException(status_code=404, detail="Work Specification not found")

@router.get("/all_work_specifications")
async def get_all_work_specifications():
    cursor = specification_collection.find({}, {"_id": 0})  # Exclude the _id field
    specifications = await cursor.to_list(length=100)
    return specifications


@router.get("/get_codes_and_descriptions")
async def get_codes_and_descriptions():
    cursor = specification_collection.find({}, {"_id": 0, "code": 1, "description": 1, "unit" : 1})  # Only get code and description fields
    codes_and_descriptions = await cursor.to_list(length=100)
    return codes_and_descriptions



@router.post("/calculate_mat")
async def calculate_materials(input_data: List[InputData]):
    total_materials = defaultdict(list)
    total_manpower = defaultdict(list)
    total_miscellaneous = defaultdict(list)
    
    for entry in input_data:
        code = entry.code
        quantity = entry.quantity
        
        # Retrieve the work specification for the code
        work_spec = await specification_collection.find_one({"code": code})
        if not work_spec:
            raise HTTPException(status_code=404, detail=f"Work Specification for code {code} not found")
        
        # if not isinstance(work_spec.get('materials'), list) or \
        # not isinstance(work_spec.get('manpower'), list) or \
        # not isinstance(work_spec.get('miscellaneous'), list):
        #     raise HTTPException(status_code=400, detail=f"Invalid data format in Work Specification for code {code}")


        def aggregate_items(target, items):
            for item in items:
                found = False
                for existing in target[item['name']]:
                    if existing['unitQuantity'] == item['unitQuantity']:
                        existing['quantity'] += float(item['unit']) * quantity
                        found = True
                        break
                if not found:
                    target[item['name']].append({
                        'quantity': float(item['unit']) * quantity,
                        'unitQuantity': item['unitQuantity']
                    })

        # Calculate materials for this code and aggregate
        aggregate_items(total_materials, work_spec.get('materials') or [])
        aggregate_items(total_manpower, work_spec.get('manpower') or [])
        aggregate_items(total_miscellaneous, work_spec.get('miscellaneous') or [])

            
    # Convert defaultdicts to dicts for JSON serialization
    return {
        "materials": dict(total_materials),
        "manpower": dict(total_manpower),
        "miscellaneous": dict(total_miscellaneous)
    }


@router.get("/get_worktype_and_code")
async def get_worktype_and_code():
    # Only get work_type, code, and unit fields
    cursor = specification_collection.find({}, {"_id": 0, "work_type": 1, "code": 1, "unit": 1})
    worktypes_and_codes = await cursor.to_list(length=100)

    worktype_to_codes = defaultdict(list)
    for item in worktypes_and_codes:
        worktype = item.get('work_type', 'Unknown work type')
        code = item.get('code')
        unit = item.get('unit', 'Unknown unit')  # Default to 'Unknown unit' if not present
        if code:
            # Append a dictionary with code and unit
            worktype_to_codes[worktype].append({'code': code, 'unit': unit})
    
    return dict(worktype_to_codes)


# BO INPUT, UPDATE, DELETE AND GETTING 
@router.post("/work-items/", response_model=WorkItemInDB)
async def create_work_item(work_item: WorkItemCreate):
    # Optionally, validate project_id here
    result = await workdetails_collection.insert_one(work_item.dict())
    new_work_item = await workdetails_collection.find_one({"_id": result.inserted_id})
    return WorkItemInDB(**new_work_item, id=str(new_work_item["_id"]))

@router.get("/work-items/{id}", response_model=WorkItemInDB)
async def get_work_item(id: str):
    work_item = await workdetails_collection.find_one({"_id": ObjectId(id)})
    if work_item:
        return WorkItemInDB(**work_item, id=str(work_item["_id"]))
    raise HTTPException(status_code=404, detail="Work item not found")

@router.get("/projects/{project_id}/work-items/", response_model=List[WorkItemInDB])
async def get_all_work_items_for_project(project_id: str):
    work_items = await workdetails_collection.find({"project_id": project_id}).to_list(1000)
    return [WorkItemInDB(**item, id=str(item["_id"])) for item in work_items]

@router.put("/work-items/{id}", response_model=WorkItemInDB)
async def update_work_item(id: str, work_item: WorkItemUpdate):
    update_result = await workdetails_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": work_item.dict(exclude_unset=True)}
    )
    if update_result.modified_count:
        updated_work_item = await workdetails_collection.find_one({"_id": ObjectId(id)})
        return WorkItemInDB(**updated_work_item, id=str(updated_work_item["_id"]))
    raise HTTPException(status_code=404, detail="Work item not found")

@router.delete("/work-items/{id}", status_code=204)
async def delete_work_item(id: str):
    delete_result = await workdetails_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count:
        return
    raise HTTPException(status_code=404, detail="Work item not found")


# ### CRUD OPERATIONS FOR PROJECTS
##########
#######

@router.post("/projects/", response_model=Project)
async def create_project(project: Project, current_user: User = Depends(get_current_user)):
    project_data = project.dict(by_alias=True)
    project_data['user_id'] = current_user.username  # Assign the current user's username as the project's user_id
    try:
        new_project = await project_collections.insert_one(project_data)
        project_data["project_id"] = str(new_project.inserted_id)
        return project_data
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Project with this name already exists")


@router.get("/projects", response_model=List[Project])
async def list_projects(current_user: User = Depends(get_current_user), limit: int = 10, skip: int = 0):
    projects_cursor = await project_collections.find({'user_id': current_user.username}).skip(skip).limit(limit).to_list(limit)
    projects = [
        Project(**{**project, "project_id": str(project['_id'])}) for project in projects_cursor
    ]
    return projects


@router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    try:
        project = await project_collections.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
        return Project(**{**project, "project_id": str(project['_id'])})
    except :
        raise HTTPException(status_code=400, detail="Invalid project ID format")

@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_update: Project):
    try:
        updated_data = project_update.dict(by_alias=True)
        update_result = await project_collections.update_one({"_id": ObjectId(project_id)}, {"$set": updated_data})
        
        if update_result.modified_count == 0:
            existing_project = await project_collections.find_one({"_id": ObjectId(project_id)})
            if existing_project:
                return Project(**existing_project)
            raise HTTPException(status_code=404, detail=f"Project {project_id} not found or data is the same as before")
        
        updated_project = await project_collections.find_one({"_id": ObjectId(project_id)})
        return Project(**updated_project)
    except :
        raise HTTPException(status_code=400, detail="Invalid project ID format")

@router.delete("/projects/{project_id}", status_code=204)
async def delete_project(project_id: str, current_user: User = Depends(get_current_user)):
    try:
        project = await project_collections.find_one({"_id": ObjectId(project_id), 'user_id': current_user.username})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found or you don't have permission to access it")

        delete_result = await project_collections.delete_one({"_id": ObjectId(project_id)})
        if delete_result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Project not found")
    except:
        raise HTTPException(status_code=400, detail="Invalid project ID format")


# @router.delete("/projects/all", status_code=204)
# async def delete_all_projects():
#     await project_collections.delete_many({})
#     return {"status": "All projects deleted successfully"}
