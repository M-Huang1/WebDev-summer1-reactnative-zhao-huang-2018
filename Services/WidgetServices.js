
import 'es6-symbol/implement';

let _singleton = Symbol();

const ADDRESS = 'http://192.168.56.1:8080';
const WIDGET_API_URL =
    'http://192.168.56.1:8080/api/widget';

class WidgetServices {
    constructor(singletonToken) {
        if (_singleton !== singletonToken)
            throw new Error('Cannot instantiate directly.');
    }

    static get instance() {
        if (!this[_singleton])
            this[_singleton] = new WidgetServices(_singleton);
        return this[_singleton]
    };

    //Finds all Widgets
    findAllWidgetsForLesson(lessonId) {
        return fetch(ADDRESS + "/api/lesson/" + lessonId + "/widget")
            .then(function (response) {
                return response.json();
            });
    }
}
export default WidgetServices