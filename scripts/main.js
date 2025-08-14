import { questions } from './questions.js'

const testStartButtons = document.getElementById('start-test')
const testBlock = document.getElementById('test-block')

let count = 0
let newQuest = []
let result = 0
let grade
let allAnswers = []
let finishTest = false

const showQuest = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const renderQuestion = () => {
  const question = newQuest[count]

  testBlock.innerHTML = `
    <h2 class="test__title">${question.questions}</h2>
    <ul class="test__list"></ul>
    <div class="test__wrappers">
      <div class="test__count">${count + 1} / ${questions.length}</div>
      <button class="test__next">${count + 1 === questions.length ? 'Завершить' : 'След. вопрос'}</button>
    </div>
  `

  const testList = document.querySelector('.test__list')
  question.answers.forEach((item, idx) => {
    const li = document.createElement('li')

    li.innerHTML = `
      <label>
        <input class="test__radio" type="radio" name="question">
        <span class="test__text"></span>
      </label> 
    `

    testList.append(li)
    const span = document.querySelectorAll('.test__text')
    span[idx].textContent += item
  })

  const nextButton = document.querySelector('.test__next')

  nextButton.addEventListener('click', () => {
    const questionsRadio = document.querySelectorAll('.test__radio')
    let radioCheck = Array.from(questionsRadio).findIndex(
      (item) => item.checked,
    )
    if (radioCheck >= 0) {
      const isCorrect = radioCheck === newQuest[count].trueAnswers - 1
      allAnswers = [...allAnswers, isCorrect]

      result = allAnswers.filter((item) => item === true).length

      switch (true) {
        case result <= 5:
          grade = 2
          break
        case result <= 10:
          grade = 3
          break
        case result <= 17:
          grade = 4
          break
        case result <= 20:
          grade = 5
          break
        default:
          grade = 'Возникла не привидинное ошибка системы'
      }

      if (count === newQuest.length - 1) {
        testBlock.innerHTML = `
        <div class="test__result">
            <h2 class="test__result-title">Тест завершен!</h2>
            <p class="test__result-points">Вы ответил правильно на <span>${result}</span> вопросов из <span>${newQuest.length}</span></p>
            <p class="test__result-grade">Ваше оценка <span>${grade}</span></p>
            <p class="test__result-information">Окно автоматический закроется через 30 секунд</p>
            <button class="test__result-close">Закрыть</button>
        </div>
       `
        finishTest = true

        setInterval(() => {
          if (finishTest) {
            testStartButtons.style.display = 'block'
            testBlock.style.display = 'none'
            finishTest = false
          }
        }, 30000)
      } else {
        count++
        renderQuestion()
      }
    } else {
      alert('Выберите сначала ответ!')
    }

    const closeResult = document.querySelector('.test__result-close')

    closeResult.addEventListener('click', (e) => {
      e.preventDefault()
      testStartButtons.style.display = 'block'
      testBlock.style.display = 'none'
    })
  })
}

testStartButtons.addEventListener('click', () => {
  testStartButtons.style.display = 'none'
  testBlock.style.display = 'block'

  count = 0
  result = 0
  grade = undefined
  allAnswers = []
  finishTest = false

  newQuest = showQuest([...questions])
  renderQuestion()
})
