from fastapi import FastAPI, Body
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
import json
import random

app = FastAPI()

current_crossword = []
validated_answers = []

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
    print(data)
    return data

@app.get("/V1/create_crossword")
async def create_crossword():
    with open("questions.json", "r", encoding="UTF-8") as data_file:
        data = json.load(data_file)
    while len(current_crossword) != 10:
        new_question = random.choice(data["crossword"])
        if new_question not in current_crossword:
            current_crossword.append(new_question)
            
    # with open("current_crossword.json", "w") as data_file:
    #      for i in crossword:
    #          json.dump(i, data_file, indent=4)
    return current_crossword

@app.get("/V1/read_crossword")
async def read_crossword():
        pass

#problem przeładowania strony wynika z operacji na pliku, trzeba użyć biblioteki aiofiles
@app.put("/V1/verify_answer", status_code=status.HTTP_201_CREATED)
async def verify_answer(data = Body()):
    # async with open("x.txt", "w", encoding="UTF-8") as data_file:
    #     await data_file.write(str(data))

    print(data)
    crossword_solved = False

    answer_verification = False
    for i in current_crossword:
        if data["answerToValidation"]["id"] == i["id"]:
            if i["answer"] == data["answerToValidation"]["answer"]:
                validated_answers.append(i)
                print(validated_answers)
                print("validated")
                answer_verification = True
            break
    if answer_verification == False:
        return {"result": [answer_verification, crossword_solved]}

    solving_counter = 0
    print(f"current_crossword length: {len(current_crossword)}")
    for i in current_crossword:
        if i not in validated_answers:
            print(i)
            solving_counter +=1
            print(f"solving_counter : {solving_counter}")

    if solving_counter == 0:
        crossword_solved = True
        print("Wygrałeś")
    
    print(answer_verification)
    #print(current_crossword)
    return {"result": [answer_verification, crossword_solved]}