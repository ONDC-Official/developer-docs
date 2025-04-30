from fastapi import FastAPI
import uvicorn
from pydantic import BaseModel
import json
from utils import vlookup

app = FastAPI()

class VLookupRequest(BaseModel):
    senderSubscriberId: str
    privateKey: str
    domain : str
    subscriberId: str
    country: str
    type_: str
    city: str
    env: str

@app.post("/vlookup")
def vlookup_func(request_data: VLookupRequest):
    request_dict = request_data.model_dump()

    try:
        result = vlookup(request_dict)
        result = json.loads(result)
        return result
    except Exception as e:
        raise e

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
