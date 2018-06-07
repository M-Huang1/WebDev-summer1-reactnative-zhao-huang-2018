let _singleton = Symbol();

const ADDRESS = 'http://192.168.56.1:8080';
const ASSIGNMENT_API_URL =
    'http://192.168.56.1:8080/api/assignment';

class AssignmentServices {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new AssignmentServices(_singleton);
        return this[_singleton]
    }

    findAssignmentById(assignmentId){
        return fetch(ASSIGNMENT_API_URL + '/' + assignmentId)
            .then(function(response){
                return response.json();
            });
    }
    findAllAssignmentForLesson(lessonId) {
        return fetch(ADDRESS+'/api/lesson/' + lessonId + '/assignment')
            .then(function(response){
                return response.json();
            });
    }

    createAssignment(assignment, lessonId) {
        return fetch(ADDRESS+'/api/lesson/' + lessonId + '/assignment', {
            body: JSON.stringify(assignment),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(function (response) {
            return response.json();
        })
    }

    deleteAssignment(id){
        return fetch(ASSIGNMENT_API_URL + "/" + id, {
            method: 'DELETE'
        }).then(function (response) {
            return response.json();
        })
    }


}
export default AssignmentServices