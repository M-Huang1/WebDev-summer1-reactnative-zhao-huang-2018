import React from 'react'
import {StyleSheet, Alert, View, Text, ScrollView, TextInput} from 'react-native'
import WidgetServices from "../Services/WidgetServices";
import AssignmentServices from "../Services/AssignmentServices";
import {FormInput,Button, FormLabel, FormValidationMessage} from "react-native-elements";


class Assignment extends React.Component{
    static navigationOptions = { title: "Assignment"};

    constructor(props) {
        super(props);
        this.assignmentService = AssignmentServices.instance;
        this.state = {
            widgets:[],
            assignment: null,
            assignmentId: this.props.navigation.getParam('assignmentId'),
            widgetTitle: '',
            widgetPoints: 0,
            widgetDescription: ''

        };


    }
    componentDidMount() {
        this.setState({assignmentId: this.props.navigation.getParam('assignmentId')});
        this.assignmentService.findAssignmentById(this.state.assignmentId).
        then((assignment) => {
            this.setState({assignment: assignment,
                widgetTitle: assignment.title,
                widgetPoints: assignment.points,
                widgetDescription: assignment.description})
        });
    }
    updateAssignment(){
        if(this.state.widgetDescription === ''){
            Alert.alert('Widget Description Is Required',
                'Please Enter A Description')
        }
        else if(this.state.widgetTitle === ''){
            Alert.alert('Widget Title Is Required',
                'Please Enter A Title')
        }
        else if(this.state.widgetPoints === ''){
            Alert.alert('Widget Points Is Required',
                'Please Enter Points')
        }
        else if(isNaN(this.state.widgetPoints)){
            Alert.alert('Widget Points Must Be A Number',
                'Please Enter A Number')
        }
        else {
            let assignment = {
                title: this.state.widgetTitle,
                description: this.state.widgetDescription,
                points: parseInt(this.state.widgetPoints),
                id: this.state.assignmentId,
                className: 'assignment'
            };
            this.assignmentService.updateAssignment(assignment).then(
                () => {
                    Alert.alert('Success',
                        'Assignment Was Updated')
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
        if(this.state.widgetPoints === ''){
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
                <Button title='Save' backgroundColor='#428bca'
                    onPress={() => this.updateAssignment()}/>
                <Button title='Delete' backgroundColor='#d9534f'
                        onPress={() => this.updateAssignment()}/>

                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>Preview</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.titleText}>{this.state.widgetTitle + '   ' + this.state.widgetPoints + 'pts'}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.baseText}>{this.state.widgetDescription}</Text>
                <Text>{"\n"}</Text>
                <Text style={styles.headerText}> Essay answer </Text>
                <View style={{
                    backgroundColor: 'white'}}
                >
                    <TextInput editable = {true}
                               multiline = {true}
                               numberOfLines = {10}
                    placeholder='Some Essay Text'/>
                </View>

                <Text>{"\n"}</Text>
                <Text style={styles.headerText}> Upload a file </Text>
                <View style={{
                    backgroundColor: 'white'}}>
                    <TextInput editable = {true}
                               multiline = {true}
                               numberOfLines = {1}
                               placeholder='No file chosen'/>
                </View>
                <Button title='Choose File'  backgroundColor='#428bca'
                         onPress={() => {}}/>
                <Text>{"\n"}</Text>
                <Text style={styles.headerText}> Submit a link</Text>
                <View style={{
                    backgroundColor: 'white'}}>
                    <TextInput editable = {true}
                               multiline = {true}
                               numberOfLines = {1}
                               />
                </View>
                <Text>{"\n"}</Text>
                <Button title='Submit'  backgroundColor='#428bca'
                        onPress={() => {}}/>
                <Button title='Cancel'  backgroundColor='#d9534f'
                        onPress={() => {}}/>
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
            </ScrollView>

        )
    }
}

export default Assignment
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