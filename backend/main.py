from fastapi import FastAPI, Request, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
import aiofiles
import json
import random

app = FastAPI()

origins = [
    "https://localhost:5500",
    "http://localhost:5500",
    "https://localhost",
    "http://127.0.0.1:5500",
    "https://127.0.0.1:5500"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/V1/get_all_questions")
async def get_all_questions():
    with open("questions.json", "r", encoding="UTF-8") as data_file:
        data = json.load(data_file)
    return data

@app.get("/V1/create_crossword")
async def create_crossword():
    with open("questions.json", "r", encoding="UTF-8") as data_file:
        data = json.load(data_file)
    crossword = []
    while len(crossword) != 10:
        new_question = random.choice(data["crossword"])
        if new_question not in crossword:
            crossword.append(new_question)
            
    async with aiofiles.open("current_crossword.json", "w", encoding="UTF-8") as data_file:
         await data_file.write(json.dumps(crossword, indent=4))
    return crossword

@app.get("/V1/read_crossword")
async def read_crossword():
    async with aiofiles.open("current_crossword.json", "r", encoding="UTF-8") as data_file:
        data = await data_file.read()
    return JSONResponse(content=json.loads(data))

@app.post("/V1/verify_answer", status_code=status.HTTP_204_NO_CONTENT)
async def verify_answer(file: UploadFile = File(...)):
    CHUNK_SIZE = 1024  # adjust this as necessary
    async with aiofiles.open("x.txt", "wb") as out_file:
        while content := await file.read(CHUNK_SIZE):
            await out_file.write(content)
    return "ok"