const x = document.getElementById("board");
const questions = document.getElementById("questions");
let created_crossword = false

async function get_data(){
  const response = await fetch("http://127.0.0.1:8000/V1/create_crossword");
  const data = await response.json();
  console.log(data)
  
  return data
}

async function create_crossword() {
    try {

      data = await get_data()
      console.log("create crossword")
      const questions = document.getElementById("questions");
      //const x = document.getElementById("crossword");
      for (let k in data) {
        const answer = document.createElement("div");
        answer.classList = "answer";
        answer.setAttribute("id", `answer-${parseInt(k) +1}`);
        const question =  document.createElement("p");
        question.textContent = (parseInt(k)+1) + ". " + data[k].question;
        questions.appendChild(question);
        for (let i=0; i < data[k].answer.length; i++) {
          const letter = document.createElement("p");
          letter.classList = "letter";
          letter.setAttribute("contenteditable", "true");
          if (i === 0) {
            const id = document.createElement("p");
            id.classList = "answer-id";
            id.textContent = parseInt(k) +1;
            answer.appendChild(id);
          }
          answer.appendChild(letter);
        }
        console.log(answer)
        x.appendChild(answer);
      }
} catch (err) {
console.log(err);
}
}


async function validAnswer(){
    const id_translation = {};
    data = await get_data()
    for (let k in data){
      id_translation[parseInt(k) +1] = data[k].id;
    }
    const board = document.getElementById("board");
    for (let i=0; i < board.children.length; i++) {
      board.children[i].addEventListener("keydown", async e => {
        try { e.preventDefault();
        
          if (e.key === "Backspace") { 
            e.target.previousElementSibling.focus();
            if (e.target.textContent === "") {
              e.target.previousElementSibling.focus();
              console.log("puste");
            } else {
              e.target.textContent = "";
            }
          } else if (e.keyCode === 37) {
            e.target.previousElementSibling.focus();
          } else if (e.keyCode === 38) {
            e.target.parentNode.previousElementSibling.lastChild.focus();
          } else if (e.keyCode === 39) {
            e.target.nextElementSibling.focus();
          } else if (e.keyCode === 40) {
            e.target.parentNode.nextElementSibling.children[1].focus();
            console.log(e.target.parentNode.nextElementSibling.children[1]);
          } else if (e.key.match(/^[a-ząćęłńóśź]$/) && !(e.altKey || e.metaKey || e.ctrlKey)) {
            e.target.textContent = e.key;
            if (e.target.nextElementSibling !== null) {
              e.target.nextElementSibling.focus();
            } else {
              e.preventDefault();
              e.currentTarget.focus();
            }
          }
      
          const word = [];
          for (let i = 1; i < e.target.parentNode.children.length; i++) {
            console.log(e.target.parentNode.children[i]);
            word.push(e.target.parentNode.children[i].textContent);
            console.log(word);
          }
      
          console.log(word.filter(w => w !== "").length);
          console.log(e.target.parentNode.children.length-1);
      
          if (word.filter(w => w !== "").length === e.target.parentNode.children.length-1) {
            const id = e.target.parentNode.children[0].textContent;
            const answerToValidation = {"id": id_translation[id], "answer": word.join("")};
            console.log(answerToValidation);
      
            if (e.key === "Enter") { 
                          e.preventDefault();
  
            const postFetch = await fetch("http://127.0.0.1:8000/V1/verify_answer", {
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },mode:"cors",
            
            method: "PUT",
            body: JSON.stringify({answerToValidation})
        }).then( async res=> {
          return await res.json()
        })

        console.log(postFetch)

        if (postFetch["result"]===false){
          for(let i =1; e.target.parentNode.children.length; i++){
            e.target.parentNode.children[i].classList.remove("correct")
            e.target.parentNode.children[i].classList.add("wrong")
          }
        } else {

            for(let i =1; e.target.parentNode.children.length; i++){
            e.target.parentNode.children[i].classList.remove("wrong")
            e.target.parentNode.children[i].classList.add("correct")
          }        }

            }
      }
      } catch(err){
        console.log(err);

      }
       
    });
    }
}

const disableSubmit = async () => {
  document.addEventListener("submit", async event =>{
    event.preventDefault()
 }, true)
}




async function runCrossword(){
    await create_crossword()
    await validAnswer()
}





runCrossword()



console.log("test")

async function test(controller){
  //document.addEventListener("load", e => e.preventDefault(), true)
  let answerToValidation = {"id": "test", "answer": "test"}
  const postFetch = await fetch("http://127.0.0.1:8000/V1/verify_answer", {
    signal: controller.signal,
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
    },mode:"cors",
    
    method: "PUT",
    body: JSON.stringify({answerToValidation})
})

}

function test2(controller){
  //document.addEventListener("load", e => e.preventDefault(), true)
  let answerToValidation = {"id": "test", "answer": "test"}
  const postFetch =  fetch("http://127.0.0.1:8000/V1/verify_answer", {
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
    },mode:"cors",
    
    method: "PUT",
    body: JSON.stringify({answerToValidation})
})

}

async function run2(){
  //alert("test")
  const controller = new AbortController()
  console.log("run2")
  await test(controller)
  controller.abort()
}

//run2()

