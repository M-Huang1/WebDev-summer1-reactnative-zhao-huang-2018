import React from 'react'
import {View} from 'react-native'
import WidgetServices from "../Services/WidgetServices";
import AssignmentServices from "../Services/AssignmentServices";

class Assignment extends React.Component{
    static navigationOptions = { title: "Assignment"};

    constructor(props) {
        super(props);
        this.assignmentService = AssignmentServices.instance;
        this.state = {
            widgets:[],
            assignmentId: this.props.navigation.getParam('assignmentId'),
            widgetTitle: '',
            widgetDescription: ''

        };


    }

    componentDidMount() {
        this.setState({assignmentId: this.props.navigation.getParam('assignmentId')});
        this.assignmentService.findAssignmentById(this.state.assignmentId)
    }
}

export default Assignment