import React from 'react'
import {Alert, View, Text, StyleSheet, ScrollView, Picker} from 'react-native'
import WidgetServices from "../Services/WidgetServices";
import ExamServices from "../Services/ExamServices";
import {FormInput, Button, FormLabel, FormValidationMessage, Divider, ListItem} from "react-native-elements";
import Assignment from "./Assignment";
import QuestionServices from "../Services/QuestionServices";


class Exam extends React.Component{
    static navigationOptions = { title: "Exam"};

    constructor(props) {
        super(props);
        this.examService = ExamServices.instance;
        this.questionService = QuestionServices.instance;
        this.state = {
            exam: null,
            examId: this.props.navigation.getParam('examId'),
            widgetPoints:0,
            widgetTitle: '',
            widgetDescription: '',
            widgetType: 'essay',
            questions:[]

        };


    }
    componentDidMount() {
        this.setState({examId: this.props.navigation.getParam('examId')});
        this.examService.findExamById(this.state.examId).
        then((exam) => {
            this.setState({exam: exam,
                widgetTitle: exam.title,
                widgetPoints: exam.points,
                widgetDescription: exam.description,
                questions: exam.questions})
        });
    }

    findQuestionForExam(){
        this.examService.findExamById(this.state.examId).
        then((exam) => {
            this.setState({exam: exam,
                questions: exam.questions})
        });
    }


    createQuestion(questionType){
        let question = {
            title: 'Title',
            description: 'Description',
            question:'Question Here',
            type:questionType,
            points: 10
        };
        if(questionType === 'essay'){
            question.instruction = 'Put the essay prompt into the question box.';
            this.questionService.createQuestion(question, this.state.examId, questionType).then((response) => {
                this.findQuestionForExam()
            });
        }
        else if(questionType === 'multiple'){
            question.instruction =
                'Put each choice as a separate line in the question box ' +
                'and put the correct choice number in the correct option box.  ';
            question.correctOption = 1;
            this.questionService.createQuestion(question, this.state.examId, questionType).then((response) => {
                this.findQuestionForExam()
            });
        }
        else if(questionType === 'fill'){
            question.instruction =
                'Put each fill in the blank question as a seperate line and put a [ ] around the correct answer that' +
                'is to be the blank ex: 2 + 2 = [4]. ';
            this.questionService.createQuestion(question, this.state.examId, questionType).then((response) => {
                this.findQuestionForExam()
            });
        }
        else if(questionType === 'true') {
            question.instruction =
                'Put the true or false question in the question box and choose whether it is ' +
                'true or false in the answer is box.';
            question.isTrue = true;
            this.questionService.createQuestion(question, this.state.examId, questionType).then((response) => {
                this.findQuestionForExam()
            });
        }
    }
    renderListOfQuestions(){
        let questions = null;
        let index = 0;
        if(this.state){
            questions = this.state.questions.map((question,index) => {
                index = index + 1;
                return (
                    <View key={index}>
                        <Text>{"\n"}</Text>
                        <Text> {'Question ' + index} </Text>
                        <Divider style={{ backgroundColor: 'grey' }} />
                        <ListItem
                            onPress={() => this.props.navigation
                                .navigate("Question", {examId: this.state.examId, questionId: question.id})}
                            key={index}
                            title={question.title}/>
                    </View>
            )
            })
        }
        return questions;

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
    deleteExam(){
        let self = this;
        Alert.alert('Are you sure you want to delete this widget?',
            'This cannot be undone.',
            [
                {text: 'Cancel', onPress: () => {}, style: 'cancel'},
                {text: 'Yes', onPress: () => {
                        this.examService
                            .deleteExam(self.state.examId)
                            .then((response) => {
                                this.props.navigation
                                    .navigate("WidgetList", {
                                        lessonId: self.props.navigation.getParam('lessonId')
                                    })
                            })
                    }}
            ])
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
            <ScrollView style={{padding: 15}}>

                <Text style={styles.titleText}>Exam Properties</Text>
                <FormLabel>Title</FormLabel>
                <FormInput value={this.state.widgetTitle} onChangeText={
                    text => this.setState({widgetTitle: text})
                }/>
                {this.renderTitleValidation()}
                <FormLabel>Description</FormLabel>
                <FormInput value={this.state.widgetDescription} onChangeText={
                    text => this.setState({widgetDescription: text})
                }/>
                {this.renderDescValidation()}
                <FormLabel>Points</FormLabel>
                <FormInput value={this.state.widgetPoints.toString()} onChangeText={
                    text => this.setState({widgetPoints: text})
                }/>
                {this.renderPointsValidation()}
                <Text>{"\n"}</Text>
                <Button title='Save' backgroundColor='#428bca'
                        onPress={() => this.updateExam()}/>
                <Button title='Delete' backgroundColor='#d9534f'
                        onPress={() => this.deleteExam()}/>
                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>Questions</Text>
                {this.renderListOfQuestions()}
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Text> Create New Question</Text>
                <Text>{"\n"}</Text>
                <Text> Question Type </Text>
                <Divider style={{ backgroundColor: 'grey' }} />
                <Picker
                    style={{shadowColor:'black'}}
                    selectedValue={this.state.widgetType}
                    onValueChange={itemValue => {
                        this.setState({widgetType: itemValue});
                    }}>
                    <Picker.Item value="fill" label="Fill In The Blank"/>
                    <Picker.Item value="multiple" label="Multiple Choice"/>
                    <Picker.Item value="true" label="True or False"/>
                    <Picker.Item value="essay" label="Essay"/>
                </Picker>
                <Divider style={{ backgroundColor: 'grey' }} />
                <Text>{"\n"}</Text>
                <Button backgroundColor='#428bca'
                        onPress={() => (this.createQuestion(this.state.widgetType))}
                        color='white'
                        title='Create'/>

                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>Preview</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>{this.state.widgetTitle + '   ' + this.state.widgetPoints + 'pts'}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.baseText}>{this.state.widgetDescription}</Text>
                <Text>{"\n"}</Text>

                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    baseText: {
        fontSize:12,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
    }
});

export default Exam