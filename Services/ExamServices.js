let _singleton = Symbol();

const ADDRESS = 'http://192.168.56.1:8080';
const EXAM_API_URL =
    'http://192.168.56.1:8080/api/exam';

class ExamServices {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new ExamServices(_singleton);
        return this[_singleton]
    }

    findExamById(examId){
        return fetch(EXAM_API_URL + '/' + examId)
            .then(function(response){
                return response.json();
            });
    }
    findAllExamForLesson(lessonId) {
        return fetch(ADDRESS+'/api/lesson/' + lessonId + '/exam')
            .then(function(response){
                return response.json();
            });
    }

    createExam(exam, lessonId) {
        return fetch(ADDRESS+'/api/lesson/' + lessonId + '/exam', {
            body: JSON.stringify(exam),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(function (response) {
            return response.json();
        })
    }

    updateExam(exam){
        return fetch(ADDRESS+'/api/exam/' + exam.id, {
            body: JSON.stringify(exam),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT'
        }).then(function (response) {
            return response.json();
        })
    }

    deleteExam(id){
        return fetch(EXAM_API_URL + "/" + id, {
            method: 'DELETE'
        }).then(function (response) {
            return response.json();
        })
    }


}
export default ExamServices