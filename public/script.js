const question = document.querySelector('#question')
const gameBoard = document.querySelector('#game-board')
const h2 = document.querySelector('h2')

function fillQuestionElements(data) {

  if (data.winner === true) {
    gameBoard.style.display = 'none'
    h2.innerText = 'WYGRAŁEŚ/AŚ !!!'
    h2.style.color = 'green'
    return
  }

  if (data.looser === true) {
    gameBoard.style.display = 'none'
    h2.innerText = 'Przegrałeś !!!'
    h2.style.color = 'red'
    return
  }
  question.innerText = `Pytanie: ${data.question}`
  for (const i in data.answers) {
    const answerEl = document.querySelector(`#answer${Number(i)+1}`)
    answerEl.innerText = data.answers[i]
  }

}

function showNextQuestion() {
  fetch('/question', {
    method: 'GET'
  }).then(res =>
    res.json()
  ).then(data => {
    fillQuestionElements(data)
  })
}

showNextQuestion()

const goodAnswersSpan = document.querySelector('#good-answers')

function handleAnswerFeedback(data) {
  goodAnswersSpan.innerText = `${data.goodAnswers + 1}/12`
  showNextQuestion()
}

function sendAnswer(answerIndex) {
  fetch(`/answer/${answerIndex}`, {
    method: 'POST'
  }).then(res =>
    res.json()
  ).then(data => {
    handleAnswerFeedback(data)
  })
}

const buttons = document.querySelectorAll('.answer-btn')
for (const button of buttons) {
  button.addEventListener('click', (e) => {
    const answerIndex = e.target.dataset.answer
    sendAnswer(answerIndex)
  })
}

const tipDiv = document.querySelector('#tip')

function handleFriendsAnswer(data) {
  tipDiv.innerText = data.text
}

function callToAFriend() {
  fetch('/help/friend', {
    method: 'GET'
  }).then(res =>
    res.json()
  ).then(data => {
    handleFriendsAnswer(data)
  })
}

document.querySelector('#callToAFriend').addEventListener('click', callToAFriend)


function handleHalfOnHalfAnswer(data) {
  if (typeof data.text === 'string') {
    tipDiv.innerText = data.text

  } else {
    for (const button of buttons) {
      if (data.answersToRemove.indexOf(button.innerText) > -1) {
        button.style.color = 'white'
      }
    }
  }
}

function halfOnHalf() {
  fetch('/help/half', {
    method: 'GET'
  }).then(res =>
    res.json()
  ).then(data => {
    handleHalfOnHalfAnswer(data)
  })
}

document.querySelector('#halfOnHalf').addEventListener('click', halfOnHalf)



function handleQuestionToTheCrowdAnswer(data) {
  if (typeof data.text === 'string') {
    tipDiv.innerText = data.text

  } else {
    data.chart.forEach((percent, index) => {
      buttons[index].innerText = `${buttons[index].innerText}: ${percent}%`
    })
  }
}


function questionToTheCrowd() {
  fetch('/help/crowd', {
    method: 'GET'
  }).then(res =>
    res.json()
  ).then(data => {
    handleQuestionToTheCrowdAnswer(data)
  })
}

document.querySelector('#questionToTheCrowd').addEventListener('click', questionToTheCrowd)