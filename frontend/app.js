const x = document.getElementById("board")
const questions = document.getElementById("questions")

fetch("http://127.0.0.1:8000/V1/create_crossword")
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        const id_translation = {}
        for(k in data){
            const answer = document.createElement("div")
            console.log(data[k])
            answer.classList = "answer"
            answer.setAttribute("id", `answer-${parseInt(k) +1}`)
            id_translation[parseInt(k) +1] = data[k].id
            const question =  document.createElement("p")
            question.textContent = (parseInt(k)+1) + ". " + data[k].question
            questions.appendChild(question)
            
            for(let i=0; i < data[k].answer.length; i++){
                const letter = document.createElement("p")
                letter.classList = "letter"
                letter.setAttribute("contenteditable", "true")
    


                if (i === 0){
                    const id = document.createElement("p")
                    id.classList = "answer-id"
                    id.textContent = parseInt(k) +1
                    answer.appendChild(id)
    
                }

                //letter.textContent = data[k].answer[i]
                
                answer.appendChild(letter)
            }
            x.appendChild(answer)
        }

        const board = document.getElementById("board")
        for(let i=0; i < board.children.length; i++){
            console.log(board.children[i])
            board.children[i].addEventListener("keydown", e =>{
                
                e.preventDefault();
                console.log(e)
           
                if (e.key === "Backspace"){ 
                    e.target.previousSibling.focus()
                    if (e.target.textContent === ""){
                        e.target.previousSibling.focus()
                        console.log("puste")
                    } else{
                        e.target.textContent = ""
                    }
                }   else if(e.keyCode === 37){
                    e.target.previousSibling.focus()
                }else if(e.keyCode === 38){
                    e.target.parentNode.previousElementSibling.lastChild.focus()
                } else if(e.keyCode === 39){
                    e.target.nextElementSibling.focus()
                } else if(e.keyCode === 40){
                    e.target.parentNode.nextElementSibling.children[1].focus()
                    console.log(e.target.parentNode.nextElementSibling.children[1])

                } else if (e.key.match(/^[a-z]$/) && !(e.altKey || e.metaKey || e.ctrlKey)){
                    e.target.textContent = e.key
                    if (e.target.nextElementSibling !== null){
                        e.target.nextElementSibling.focus()
                    } else{
                        e.preventDefault()
                        e.currentTarget.focus()
                    }
                }
     
                const word = []
                 for (let i = 1; i < e.target.parentNode.children.length; i++){
                    console.log(e.target.parentNode.children[i])
                    word.push(e.target.parentNode.children[i].textContent)
                    console.log(word)
                 }

                 console.log(word.filter(w => w !== "").length)
                 console.log(e.target.parentNode.children.length-1)

                 if (word.filter(w => w !== "").length === e.target.parentNode.children.length-1){
                     const id = e.target.parentNode.children[0].textContent
                     //console.log(id)
                     //console.log(id_translation)
                    const answerToValidation = {"id": id_translation[id], answer: word.join("")}
                    console.log(answerToValidation)

                     fetch("http://127.0.0.1:8000/V1/verify_answer",
                     {
                         headers: {
                             "Accept": "application/json",
                             "Content-type": "application/json"
                         }, mode:"no-cors",
                             method: "POST",
                             body: JSON.stringify({answerToValidation})
                    }    
                     ).then(function(res){console.log(res)}).catch(function(res){console.log(res)})
                    
                 }

            })
            
        }
    
    });

