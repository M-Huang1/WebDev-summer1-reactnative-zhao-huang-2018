import React from 'react'
import {Alert, View, Text} from 'react-native'
import WidgetServices from "../Services/WidgetServices";
import ExamServices from "../Services/ExamServices";
import {FormInput,Button, FormLabel, FormValidationMessage} from "react-native-elements";


class Exam extends React.Component{
    static navigationOptions = { title: "Exam"};

    constructor(props) {
        super(props);
        this.examService = ExamServices.instance;
        this.state = {
            widgets:[],
            exam: null,
            examId: this.props.navigation.getParam('examId'),
            widgetPoints:0,
            widgetTitle: '',
            widgetDescription: ''

        };


    }
    componentDidMount() {
        this.setState({examId: this.props.navigation.getParam('examId')});
        this.examService.findExamById(this.state.examId).
        then((exam) => {
            this.setState({exam: exam,
                widgetTitle: exam.title,
                widgetPoints: exam.points,
                widgetDescription: exam.description})
        });
    }
    updateExam(){
        if(this.state.widgetDescription === ''){
            Alert.alert('Widget Description Is Required',
                'Please Enter A Description')
        }
        else if(this.state.widgetTitle === ''){
            Alert.alert('Widget Title Is Required',
                'Please Enter A Title')
        }
        else if(isNaN(this.state.widgetPoints)){
            Alert.alert('Widget Points Must Be A Number',
                'Please Enter A Number')
        }
        else {
            let exam = {
                title: this.state.widgetTitle,
                description: this.state.widgetDescription,
                id: this.state.examId,
                points: parseInt(this.state.widgetPoints),
                className: 'exam'
            };
            this.examService.updateExam(exam).then(
                () => {
                    Alert.alert('Success',
                        'Exam Was Updated')
                }
            );
        }

    }
    renderTitleValidation(){
        if(this.state.widgetTitle === ''){
            return (<FormValidationMessage>
                Title is required
            </FormValidationMessage>)
        }
    }

    renderDescValidation(){
        if(this.state.widgetDescription === ''){
            return ( <FormValidationMessage>
                Description is required
            </FormValidationMessage>)
        }
    }
    renderPointsValidation(){
        if(this.state.widgetPoints=== '' ){
            return ( <FormValidationMessage>
                Exam Points are required
            </FormValidationMessage>)
        }
        else if(isNaN(this.state.widgetPoints)){
            return ( <FormValidationMessage>
                Exam Points Must Be a Number
            </FormValidationMessage>)
        }
    }


    render() {
        return(
            <View style={{padding: 15}}>
                <FormLabel>Title</FormLabel>
                <FormInput value={this.state.widgetTitle} onChangeText={
                    text => this.setState({widgetTitle: text})
                }/>
                {this.renderTitleValidation()}


                <FormLabel>Description</FormLabel>
                <FormInput value={this.state.widgetDescription} onChangeText={
                    text => this.setState({widgetDescription: text})
                }/>
                <FormLabel>Points</FormLabel>
                <FormInput value={this.state.widgetPoints.toString()} onChangeText={
                    text => this.setState({widgetPoints: text})
                }/>
                {this.renderPointsValidation()}
                {this.renderDescValidation()}
                <Button title='Save' backgroundColor='#428bca'
                        onPress={() => this.updateExam()}/>
                <Button title='Delete' backgroundColor='#d9534f'
                        onPress={() => this.updateExam()}/>
                <Text>{"\n"}</Text>
                <Text h1>Preview</Text>
                <Text>{"\n"}</Text>
                <Text h1>{this.state.widgetTitle}</Text>
                <Text>{"\n"}</Text>
                <Text>{this.state.widgetDescription}</Text>
                <Text>{"\n"}</Text>
                <Text>{this.state.widgetPoints}</Text>
            </View>
        )
    }
}

export default Exam