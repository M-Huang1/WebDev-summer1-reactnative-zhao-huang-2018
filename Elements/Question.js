import React from 'react'
import {StyleSheet, Alert, View, Text, ScrollView, TextInput, Picker} from 'react-native'
import WidgetServices from "../Services/WidgetServices";
import AssignmentServices from "../Services/AssignmentServices";
import {FormInput,Button, FormLabel, FormValidationMessage} from "react-native-elements";
import QuestionServices from "../Services/QuestionServices";
import ExamServices from "../Services/ExamServices";


class Question extends React.Component
{
    static
    navigationOptions = {title: "Question"};

    constructor(props)
    {
        super(props);
        this.examService = ExamServices.instance;
        this.questionService = QuestionServices.instance;
        this.state = {
            questionId: this.props.navigation.getParam('questionId'),
            question: null,
            questionTitle: 'Title',
            questionPoints: 10,
            questionDescription: 'Desc',
            questionInstruction: 'Int',
            questionContent: 'Content',
            questionType: 'Essay',
            questionIsTrue: false,
            questionOption: 1,
            examId: this.props.navigation.getParam('examId'),

        };


    }

    componentDidMount() {
        this.questionService.findQuestionById(this.state.questionId).
        then((question) => {
            this.setState({
                question: question,
                questionTitle: question.title,
                questionPoints: question.points,
                questionDescription: question.description,
                questionInstruction: question.instruction,
                questionContent: question.question,
                questionType: question.type});
            if(this.state.questionType === 'true'){
                this.setState({
                    questionIsTrue: question.isTrue
                })
            }
        })

    }

    renderTitleValidation(){
        if(this.state.questionTitle === ''){
            return (<FormValidationMessage>
                Title is required!
            </FormValidationMessage>)
        }
    }
    renderContentValidation(){
        if(this.state.questionContent === ''){
            return (<FormValidationMessage>
                Question Content is required!
            </FormValidationMessage>)
        }
        if(this.state.questionType === 'fill'){
            if(new RegExp(".*\\[.+\\].*").test(this.state.questionContent)  === false){
                return (<FormValidationMessage>
                    Question must contain [ ] with an answer in the box. IE: 2 + 2 = [4]
                </FormValidationMessage>)
            }
        }
    }
    renderDescValidation(){
        if(this.state.questionDescription === ''){
            return ( <FormValidationMessage>
                Description is required!
            </FormValidationMessage>)
        }
    }
    renderPointsValidation(){
        if(this.state.questionPoints=== '' ){
            return ( <FormValidationMessage>
                Exam Points are required!
            </FormValidationMessage>)
        }
        else if(isNaN(this.state.questionPoints)){
            return ( <FormValidationMessage>
                Exam Points Must Be a Number
            </FormValidationMessage>)
        }
    }
    updateQuestion(){
        if(this.state.questionDescription === ''){
            Alert.alert('Question Description Is Required',
                'Please Enter A Description')
        }
        else if(this.state.questionTitle === ''){
            Alert.alert('Question Title Is Required',
                'Please Enter A Title')
        }
        else if(this.state.questionContent === ''){
            Alert.alert('Question Content Is Required',
                'Please Enter Question Content')
        }
        else if(isNaN(this.state.questionPoints)){
            Alert.alert('Question Points Must Be A Number',
                'Please Enter A Number')
        }
        else if(this.state.questionType === 'fill' &&
            new RegExp(".*\\[.+\\].*").test(this.state.questionContent)  === false){
            Alert.alert('Question must contain [ ] with an answer in the box.',
                'Example: 2 + 2 = [4]')
        }
        else {
            let question = {
                title: this.state.questionTitle,
                instruction: this.state.question.instruction,
                description: this.state.questionDescription,
                question: this.state.questionContent,
                id: this.state.questionId,
                points: parseInt(this.state.questionPoints),
                type: this.state.question.type
            };
            if(question.type ==='true'){
                question.isTrue = this.state.questionIsTrue
            }
            this.questionService.updateQuestion(question, question.type).then(
                () => {
                    Alert.alert('Success',
                        'Question Was Updated')
                }
            );
        }

    }

    renderQuestion(){
        if (this.state.questionType === 'fill'){
            let textList = this.state.questionContent.split('\n');
            return textList.map((text,index) => {
                let left = text.indexOf('[');
                let right = text.indexOf(']');
                let leftText = text.substring(0, left);
                let rightText = text.substring(right + 1,);
                return (
                    <View key={index} style={{flexDirection: 'row'}}>
                        <Text style={styles.baseText}>{leftText}</Text>
                        <View style={{
                            backgroundColor: 'white',
                            paddingLeft: 25
                        }}>
                            <TextInput
                                style={styles.baseText}
                                numberOfLines={1}
                                maxWidth={30}
                            />
                        </View>
                        <Text style={styles.baseText}>{rightText}</Text>
                        <Text>{"\n"}</Text>
                    </View>
                )
            })
        }
        if (this.state.questionType === 'multiple'){

            return (
                <View>
                    <Picker
                        style={{shadowColor:'black'}}
                        selectedValue={this.renderBooleans()}>
                        {this.renderListOfMC()}
                    </Picker>
                </View>
            )

        }

        if(this.state.questionType === 'essay'){
            return (
                <View >
                    <Text> {this.state.questionContent} </Text>
                    <View style={{
                        backgroundColor: 'white',
                        paddingLeft: 25
                    }}>
                        <TextInput
                            style={styles.baseText}
                            numberOfLines={10}
                            multiLine = {true}
                        />
                    </View>
                    <Text>{"\n"}</Text>
                </View>
            )
        }

        if(this.state.questionType === 'true'){
            return (
                <View >
                    <Text> {this.state.questionContent} </Text>
                    <View style={{
                    backgroundColor: 'white'}}>
                        <Picker
                            style={{shadowColor:'black'}}
                            selectedValue={this.renderBooleans()}

                           >
                            <Picker.Item value="true" label="True"/>
                            <Picker.Item value="false" label="False"/>
                        </Picker>
                    </View>

                    <Text>{"\n"}</Text>
                </View>
            )
        }
    }
    renderListOfMC(){
        let index = 0;
        let textList = this.state.questionContent.split('\n');
        return textList.map((text,index)=> {
            index = index + 1;
            return <Picker.Item key={index} value={text} label={index + ': ' + text}/>
        })
    }
    renderBooleans(){
        if(this.state.questionIsTrue === true){
            return "true";
        }
        else{

            return "false";

        }
    }



    renderIsTrue(){
        if(this.state.questionType ==='true'){
            return(
                <View>
                    <Text>{"\n"}</Text>
                    <FormLabel>Answer</FormLabel>
                    <View style={{
                    backgroundColor: 'white'}}>
                        <Text>{"\n"}</Text>
                        <Picker
                            style={{shadowColor:'black'}}
                            onValueChange={itemValue => {
                                if(itemValue === 'true'){

                                    this.setState({
                                        questionIsTrue: true
                                    });
                                }
                                else if(itemValue === 'false'){
                                    this.setState({
                                        questionIsTrue: false
                                    });
                                }
                            }}
                            selectedValue={this.renderBooleans()}>
                            <Picker.Item value="true" label="True"/>
                            <Picker.Item value="false" label="False"/>
                        </Picker>
                </View></View>
            )
        }
    }
    render(){
        return(
            <ScrollView style={{padding: 15}}>
                <Text style={styles.titleText}>Exam Properties</Text>
                <Text> {'Instructions: ' + this.state.questionInstruction} </Text>
                <FormLabel>Title</FormLabel>
                <FormInput value={this.state.questionTitle} onChangeText={
                    text => this.setState({questionTitle: text})
                }/>
                {this.renderTitleValidation()}
                <FormLabel>Description</FormLabel>
                <FormInput value={this.state.questionDescription} onChangeText={
                    text => this.setState({questionDescription: text})
            }/>
                {this.renderDescValidation()}
                <FormLabel>Points</FormLabel>
                <FormInput value={this.state.questionPoints.toString()} onChangeText={
                    text => this.setState({questionPoints: text})
            }/>
                {this.renderPointsValidation()}

                <FormLabel>Question Content</FormLabel>
                <View style={{
                    backgroundColor: 'white',
                    padding: 0}}>
                    <TextInput
                        multiline = {true}
                        numberOfLines = {5}
                        value={this.state.questionContent}
                        onChangeText={
                        text => this.setState({questionContent: text})}/>
                </View>
                {this.renderContentValidation()}
                {this.renderIsTrue()}
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Button title='Save' backgroundColor='#428bca'
                        onPress={() => this.updateQuestion()}/>
                <Button title='Delete' backgroundColor='#d9534f'
                        onPress={() => {}}/>
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>Preview</Text>
                <Text style={styles.titleText}>{this.state.questionTitle + '   ' + this.state.questionPoints + 'pts'}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.baseText}>{this.state.questionDescription}</Text>
                <Text>{"\n"}</Text>
                {this.renderQuestion()}

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
export default Question
