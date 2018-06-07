import React, {Component} from 'react'
import {View,ScrollView, Alert, Picker} from 'react-native'
import {Text,ListItem, Button, FormLabel, Divider} from 'react-native-elements'
import WidgetServices from "../Services/WidgetServices";
import AssignmentServices from '../Services/AssignmentServices';
import ExamServices from "../Services/ExamServices";


class WidgetList extends Component {
    static navigationOptions = {title: 'Widgets'};
    constructor(props) {
        super(props);
        this.widgetService = WidgetServices.instance;
        this.assignmentService = AssignmentServices.instance;
        this.examService = ExamServices.instance;
        this.state = {
            widgets:[],
            lessonId: 2,

            widgetType: 'assignment'

        };
    }

    componentDidMount() {
        this.setState({lessonId: this.props.navigation.getParam('lessonId')});
        this.widgetService.findAllWidgetsForLesson(this.state.lessonId)
            .then(widgets => this.setState({widgets:widgets}))
    }

    findAllWidgetsByLesson(){
        this.widgetService.findAllWidgetsForLesson(this.state.lessonId)
            .then(widgets => this.setState({widgets:widgets}))
    }

    createWidget(){
        let Widget={
            className:this.state.widgetType,
            title:'',
            points:100,
            description:'Sample Description'
        };
        if(Widget.className === 'assignment'){
            Widget.title = 'Assignment Title';
            this.assignmentService.createAssignment(Widget, this.state.lessonId).
                then(() => {
                    this.findAllWidgetsByLesson()
            })

        }
        else if(Widget.className === 'exam'){
            Widget.title = 'Exam Title';
            this.examService.createExam(Widget, this.state.lessonId).
            then(() => {
                this.findAllWidgetsByLesson()
            })

        }
    }

    navigateToWidget(widget){
        if (widget.className === 'assignment'){
            this.props.navigation
                .navigate("Assignment", {assignmentId: widget.id})
        }
        else if (widget.className === 'exam') {
            this.props.navigation
                .navigate("Exam", {examId: widget.id})
        }
    }

    renderListOfWidgets(){
        let widgets = null;
        if(this.state){
            widgets = this.state.widgets.map((widget,index) => {
                return <ListItem
                    onPress={()=> {
                        this.navigateToWidget(widget)
                    }
                    }
                    key={index}
                    title={widget.title}/>
            })
        }
        return widgets;

    }
    render() {
        return(


            <ScrollView style={{padding: 15}}>
                {this.renderListOfWidgets()}
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Text>{"\n"}</Text>
                <Text> Create New Widget</Text>
                <Text>{"\n"}</Text>
                <Text> Widget Type </Text>
                <Divider style={{ backgroundColor: 'grey' }} />
                <Picker
                    style={{shadowColor:'black'}}
                    selectedValue={this.state.widgetType}
                    onValueChange={itemValue => {
                    this.setState({widgetType: itemValue});
                    }}>
                    <Picker.Item value="assignment" label="Assignment"/>
                    <Picker.Item value="exam" label="Exam"/>
                </Picker>
                <Divider style={{ backgroundColor: 'grey' }} />
                <Text>{"\n"}</Text>
                <Button backgroundColor='#428bca'
                        onPress={() => this.createWidget()}
                        color='white'
                        title='Create'/>

            </ScrollView>
        )
    }
}

export default WidgetList