function gameRoutes(app) {
  let goodAnswers = 0
  let isGameOver = 0
  let callToAFriendUsed = false
  let questionToTheCrowdUsed = false
  let halfOnHalfUsed = false

  const questions = [{
      question: 'Co ukoi nerwy i zastąpi cytrynę??',
      answers: ['melisa lekarska', 'mięta pieprzowa', 'jaskółcze ziele', 'ziele angielskie'],
      correctAnswer: 0
    },
    {
      question: 'W piosence Dwa plus Jeden pada propozycja: "Chodź pomaluj mój świat...?',
      answers: ['niech wygląda jak kwiat"', 'mam już dość szarych krat"', 'na żółto i na niebiesko"', 'bo świat jest dziś pod kreską"'],
      correctAnswer: 2
    },
    {
      question: 'Co jest tradycyjnym środkiem transportu amiszów?',
      answers: ['motorówka', 'zaprzęg', 'śnieżny skuter', 'motocykl'],
      correctAnswer: 1
    },
    {
      question: 'Pęd wyrosły z nieuszlachetnionej podkładki to:',
      answers: ['kot albo pies', 'wilk albo dzik', 'koń albo krowa', 'baran albo kozioł'],
      correctAnswer: 1
    },
    {
      question: 'Tytułowa wataha z serialu wyreżyserowanego m.in. przez Kasię Adamik to:',
      answers: ['wilcza rodzina', 'rosyjscy szpiedzy', 'strażnicy graniczni', 'uchodźcy ze Wschodu'],
      correctAnswer: 2
    },
    {
      question: 'Których bierek w bierkach jest najwięcej?',
      answers: ['wioseł', 'bosaków', 'trójzębów', 'oszczepów'],
      correctAnswer: 3
    },
    {
      question: 'W jakiej bitwie miał swój udział sławny w Polsce i Szkocji kapral niedźwiedź o imieniu Wojtek?',
      answers: ['pod Grundwaldem', 'pod Wiedniem', 'pod Monte Cassino', 'o Anglię'],
      correctAnswer: 2
    },
    {
      question: 'Aorta wychodzi z lewej komory serca, a kończy się:',
      answers: ['w prawej komorze', 'w jamie brzusznej', 'w płuchach', 'w mózgu'],
      correctAnswer: 1
    },
    {
      question: 'Autor dwóch pozycji - "Książki, którą napisałem, żeby mieć na dziwki i narkotyki" i "Książki, którą napisałem, żeby mieć na odwyk" to:',
      answers: ['Marek Raczkowski', 'Maciej Maleńczuk', 'Kamil Durczok', 'Witkacy'],
      correctAnswer: 0
    },
    {
      question: 'Symbol waluty euro to stylizowana litera grecka. Która?',
      answers: ['beta', 'heta', 'eta', 'epsilon'],
      correctAnswer: 3
    },
    {
      question: 'Za 30 judaszowych srebrników arcykapłani kupili kawałek ziemi nazywany Polem Garncarza, który przeznaczyli na:',
      answers: ['plantację oliwek', 'wybieg dla lwów', 'cmentarz dla cudzoziemców', 'targowisko'],
      correctAnswer: 2
    },
    {
      question: 'Ile to jest 1111 razy 1111, jeśli 1 razy 1 to 1, a 11 razy 11 to 121',
      answers: ['12 321', '1 234 321', '111 111 111', '123 454 321'],
      correctAnswer: 1
    },
  ]

  app.get('/question', (req, res) => {
    if (goodAnswers === questions.length) {
      res.json({
        winner: true
      })
    } else if (isGameOver) {
      res.json({
        looser: true
      })
    } else {
      const nextQuestion = questions[goodAnswers]
      const {
        question,
        answers
      } = nextQuestion
      res.json({
        question,
        answers
      })
    }
  })
  app.post('/answer/:index', (req, res) => {
    if (isGameOver) {
      res.json({
        looser: true
      })
    }

    const {
      index
    } = req.params

    const question = questions[goodAnswers]
    const isGoodAnswer = question.correctAnswer === Number(index)
    if (isGoodAnswer) {
      goodAnswers++
    } else {
      isGameOver = true
    }

    res.json({
      correct: isGoodAnswer,
      goodAnswers
    })

  })
  app.get('/help/friend', (req, res) => {
    if (callToAFriendUsed) {
      return res.json({
        text: 'To koło ratunkowe było już wykorzystane'
      })
    }
    callToAFriendUsed = true

    const doesFriendKnowAnswer = Math.random() < 0.5
    const question = questions[goodAnswers]

    res.json({
      text: doesFriendKnowAnswer ? `Wydaje mi się, że odpowiedź to: ${question.answers[question.correctAnswer]}` : 'Niestety, nie wiem'
    })
  })
  app.get('/help/half', (req, res) => {
    if (halfOnHalfUsed) {
      return res.json({
        text: 'To koło ratunkowe było już wykorzystane'
      })
    }
    halfOnHalfUsed = true

    const question = questions[goodAnswers]

    const answersCopy = question.answers.filter((s, index) => (
      index !== question.correctAnswer
    ))
    answersCopy.splice(Math.floor(Math.random() * answersCopy.length), 1)

    res.json({
      answersToRemove: answersCopy
    })
  })
  app.get('/help/crowd', (req, res) => {
    if (questionToTheCrowdUsed) {
      return res.json({
        text: 'To koło ratunkowe było już wykorzystane.',
      });
    }

    questionToTheCrowdUsed = true;

    const chart = [10, 20, 30, 40]

    for (let i = chart.length - 1; i > 0; i--) {
      const change = Math.floor(Math.random() * 20 - 10)
      chart[i] += change
      chart[i - 1] -= change
    }

    const question = questions[goodAnswers]
    const {
      correctAnswer
    } = question;

    [chart[3], chart[correctAnswer]] = [chart[correctAnswer], chart[3]]

    res.json({
      chart
    })
  })
}

module.exports = gameRoutes