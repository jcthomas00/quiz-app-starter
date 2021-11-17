//Your quiz functionality goes here

const showCustomQForm = () => {
    return (`
        <form id="customQuestion">
            <div class="input-group">
                <input required type="text" name="question" class="form-control" placeholder="Enter your question here." >
                </div>
            <div class="input-group">
                <div class="input-group-text">
                    <input name="correct" class="form-check-input mt-0" type="radio" value="answer1" aria-label="Radio button for following text input">
                </div>
                <input required name="answer1" placeholder="Enter answer number 1 here." type="text" class="form-control" >
            </div>
            <div class="input-group">
                <div class="input-group-text">
                    <input name="correct" class="form-check-input mt-0" type="radio" value="answer2" aria-label="Radio button for following text input">
                </div>
                <input required name="answer2" placeholder="Enter answer number 2 here." type="text" class="form-control" >
            </div>
            <div class="input-group">
                <div class="input-group-text">
                    <input name="correct" class="form-check-input mt-0" type="radio" value="answer3" aria-label="Radio button for following text input">
                </div>
                <input required name="answer3" placeholder="Enter answer number 3 here." type="text" class="form-control" >
            </div>
            <div class="input-group">
                <div class="input-group-text">
                    <input name="correct" class="form-check-input mt-0" type="radio" value="answer4" aria-label="Radio button for following text input">
                </div>
                <input required name="answer4" placeholder="Enter answer number 4 here." type="text" class="form-control" >
            </div>
            <input class="btn btn-success" id="submit_question" value="Submit">  
        </form>
    `)
}

//question form template, returns string
const questionToForm = (q,i) => {
    return (`
        <form id="question_${i}">
            <h3>${q.question}</h3>
                <input type="radio" id="option1" name="question_${i}" value="${q.answer1}">
                <label for="option1">${q.answer1}</label><br>
                <input type="radio" id="option2" name="question_${i}" value="${q.answer2}">
                <label for="option2">${q.answer2}</label><br>
                <input type="radio" id="option3" name="question_${i}" value="${q.answer3}">
                <label for="option3">${q.answer3}</label><br>
                <input type="radio" id="option4" name="question_${i}" value="${q.answer4}">
                <label for="option4">${q.answer4}</label>
                <br><br>
                <input class="btn btn-success" id="submit_answer" value="Submit">  
                <input class="btn btn-secondary" id="reset" value="Reset">  
                <input class="btn btn-warning" id="customq" value="CustomQ"> 
        </form>
         <!-- <p>A: ${q[q.correct]}</p> -->
    `)
}

//check answer, returns boolean val
const evaluate = (q, ans) => {
    return (q[q.correct] === ans)
}

//pops up a modal
const showModal = (title, msg) => {
    const theeModal = document.querySelector('#theeModal');
    theeModal.querySelector('.modal-title').innerHTML = title;
    theeModal.querySelector('.modal-body').innerHTML = msg;
    const myModal = new bootstrap.Modal(theeModal);
    myModal.show()
}

const showResults = (result) => {
    const correct = result.filter(val => val===true).length;
    return (`
        <h3>${correct/result.length > .7 ? "You're a Hottie":"You're a Coldie"}</h3>
        <p>You got ${correct} questions correct out of ${result.length}</p>
        <input class="btn btn-secondary" id="reset" value="Take the quiz again!">  
    `)
}

const setCustomQuestions = (customQs) => {
    sessionStorage.setItem('customQuestions', JSON.stringify(customQs));
    return questions.concat(customQs);
}

const main = () =>{
    const quizSlot = document.querySelector('#quizSlot');
    let questionIndex = 0, result = [], customQs = [],
        customQuestions = JSON.parse(sessionStorage.getItem('customQuestions'));

    let allQuestions = customQuestions===null ? questions:questions.concat(customQuestions);
    quizSlot.innerHTML = questionToForm(allQuestions[questionIndex], questionIndex);

    quizSlot.addEventListener('click', (e) => {
        if(e.target.id === 'submit_answer'){
            e.preventDefault(); 
            const input = Array.from(new FormData(e.target.parentNode).entries())[0];
            if(input){
                result.push(evaluate(allQuestions[input[0].substring(9)], input[1]));
                if(++questionIndex < allQuestions.length){
                    quizSlot.innerHTML = questionToForm(allQuestions[questionIndex], questionIndex);
                } else{
                    quizSlot.innerHTML = showResults(result);
                }
            }else{
                showModal("I don't think so.","You gotta pick an answer to submit.")
            }
        } else if(e.target.id === 'reset'){
            result = [];
            questionIndex = 0;
            quizSlot.innerHTML = questionToForm(allQuestions[questionIndex], questionIndex);
        } else if(e.target.id === 'customq'){
            quizSlot.innerHTML = showCustomQForm();
        } else if(e.target.id === 'submit_question'){
            const input = Object.fromEntries(new FormData(e.target.parentNode).entries());
            if(input['correct']){
                customQs.push(input)
                allQuestions = setCustomQuestions(customQs);
                quizSlot.innerHTML = questionToForm(allQuestions[questionIndex], questionIndex);
            }else{
                showModal("I don't think so.","You gotta pick a correct answer.")
            }
        }
    })
}

document.addEventListener('DOMContentLoaded', main)
