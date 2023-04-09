function get_all(){
    fetch("http://127.0.0.1:8000/V1/get_all_questions")
    .then((response) => response.json())
    .then((data) => {
      for(let i=0; i < data.crossword.length; i++){
          const answer = document.createElement("div")
  
          for(let j=0; j < data.crossword[i].answer.length; j++){
              console.log(data.crossword[i].answer[j])
              const letter = document.createElement("button")
              if (j === 0){
                  const id = document.createElement("button")
                  id.textContent = i+1
                  answer.appendChild(id)
  
              }
              letter.textContent = data.crossword[i].answer[j]
              answer.appendChild(letter)
          }
          const question =  document.createElement("p")
          console.log( data.crossword[i].question)
          question.textContent = data.crossword[i].id + ". " + data.crossword[i].question
          questions.appendChild(question)
          //console.log(letter)
          x.appendChild(answer)
        }
    });
}