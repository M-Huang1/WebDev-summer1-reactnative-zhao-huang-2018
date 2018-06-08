let _singleton = Symbol();

const ADDRESS = 'http://192.168.56.1:8080';
const QUESTION_API_URL =
    'http://192.168.56.1:8080/api/question';

class QuestionServices {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new QuestionServices(_singleton);
        return this[_singleton]
    }

    findQuestionById(questionId){

        return fetch(QUESTION_API_URL + '/' + questionId)
            .then(function(response){
                return response.json();
            });
    }

    findAllQuestionForExam(examId){
        return fetch(ADDRESS + '/api/exam/' + examId +'/question')
            .then(function(response){
                return response.json();
            });
    }

    updateQuestion(question, type){
        return fetch(
            ADDRESS+'/api/question/' + question.id +'/' +type, {
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        }).then(function (response) {
            return response.json();
        })
    }
    createQuestion(question, examId, type) {

        return fetch(ADDRESS+'/api/exam/' + examId + '/' + type, {
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(function (response) {
            return response.json();
        })
    }

    deleteQuestion(id){
        return fetch(QUESTION_API_URL + "/" + id, {
            method: 'DELETE'
        }).then(function (response) {
            return response.json();
        })
    }

}
export default QuestionServices