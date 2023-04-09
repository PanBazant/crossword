const x = document.getElementById("board")
const questions = document.getElementById("questions")

(async function() {
  try {
    const response = await fetch("http://127.0.0.1:8000/V1/create_crossword")
    const data = await response.json()
    console.log(data)

    const id_translation = {}

    for (let k in data) {
      const answer = document.createElement("div")
      console.log(data[k])
      answer.classList = "answer"
      answer.setAttribute("id", `answer-${parseInt(k) + 1}`)
      id_translation[parseInt(k) + 1] = data[k].id
      const question = document.createElement("p")
      question.textContent = (parseInt(k) + 1) + ". " + data[k].question
      questions.appendChild(question)

      for (let i = 0; i < data[k].answer.length; i++) {
        const letter = document.createElement("p")
        letter.classList = "letter"
        letter.setAttribute("contenteditable", "true")

        if (i === 0) {
          const id = document.createElement("p")
          id.classList = "answer-id"
          id.textContent = parseInt(k) + 1
          answer.appendChild(id)
        }

        // letter.textContent = data[k].answer[i]
        answer.appendChild(letter)
      }
      x.appendChild(answer)
    }

    const board = document.getElementById("board")

    for (let i = 0; i < board.children.length; i++) {
      console.log(board.children[i])
      board.children[i].addEventListener("keydown", async (e) => {
        e.preventDefault()
        console.log(e)

        if (e.key === "Backspace") {
          e.target.previousSibling.focus()
          if (e.target.textContent === "") {
            e.target.previousSibling.focus()
            console.log("puste")
          } else {
            e.target.textContent = ""
          }
        } else if (e.keyCode === 37) {
          e.target.previousSibling.focus()
        } else if (e.keyCode === 38) {
          e.target.parentNode.previousElementSibling.lastChild.focus()
        } else if (e.keyCode === 39) {
          e.target.nextElementSibling.focus()
        } else if (e.keyCode === 40) {
          e.target.parentNode.nextElementSibling.children[1].focus()
          console.log(e.target.parentNode.nextElementSibling.children[1])
        } else if (e.key.match(/^[a-z]$/) && !(e.altKey || e.metaKey || e.ctrlKey)) {
          e.target.textContent = e.key
          if (e.target.nextElementSibling !== null) {
            e.target.nextElementSibling.focus()
          } else {
            e.preventDefault()
            e.currentTarget.focus()
          }
        }

        const word = []

        for (let i = 1; i < e.target.parentNode.children.length; i++) {
          console.log(e.target.parentNode.children[i])
          word.push(e.target.parentNode.children[i].textContent)
          console.log(word)
        }

        console.log(word.filter((w) => w !== "").length)
        console.log(e.target.parentNode.children.length - 1)

        if (word.filter((w) => w !== "").length === e.target.parentNode.children.length - 1) {
          const id = e.target.parentNode.children[0].textContent
          const answerToValidation = { "id": id_translation[id], answer: word.join("") }
          console.log(answerToValidation)

          try {
            const res = await fetch("http://127.0.0.1:8000/V1/check_answer", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify(answerToValidation)
            })

            const result = await res.json()

            console.log(result)

            if (result.correct) {
              const answerId = `answer-${id}`
              const answer = document.getElementById(answerId)
              answer.classList.add("correct")

              for (let i = 1; i < answer.children.length; i++) {
                answer.children[i].setAttribute("contenteditable", "false")
              }

              if (document.querySelectorAll(".correct").length === board.children.length) {
                const modal = document.getElementById("modal")
                const modalContent = document.getElementById("modal-content")
                modal.style.display = "block"

                const message = document.createElement("p")
                message.textContent = "Congratulations! You completed the crossword."
                modalContent.appendChild(message)

                const closeButton = document.createElement("button")
                closeButton.setAttribute("id", "close-button")
                closeButton.textContent = "Close"
                modalContent.appendChild(closeButton)

                closeButton.addEventListener("click", () => {
                  modal.style.display = "none"
                })
              }
            }
          } catch (error) {
            console.log(error)
          }
        })
      }

      const newGameButton = document.getElementById("new-game")
      newGameButton.addEventListener("click", () => {
        location.reload()
      })
    } catch (error) {
      console.log(error)
    }
  })()