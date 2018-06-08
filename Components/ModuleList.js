import React, {Component} from 'react'
import {View} from 'react-native'
import {Text, ListItem} from 'react-native-elements'

class ModuleList extends Component {
    static navigationOptions = {title: 'Modules'};
    constructor(props) {
        super(props);
        this.state = {
            modules: [],
            courseId: 1
        }
    }
    componentDidMount() {
        const courseId = this.props.navigation.getParam("courseId", 1);
        this.setState({
            courseId: courseId
        });
        fetch('http://192.168.56.1:8080/api/course/' + courseId + '/module')
            .then(response => (response.json()))
            .then(modules => this.setState({modules: modules}))
    }

    render() {
        return(
            <View style={{padding: 15}}>
                {this.state.modules.map((module, index) => (
                    <ListItem
                        onPress={() => this.props.navigation
                            .navigate("LessonList", {courseId:
                                this.state.courseId, moduleId: module.id})}
                        key={index}
                        title={module.title}/>
                ))}
            </View>
        )
    }
}
export default ModuleList
