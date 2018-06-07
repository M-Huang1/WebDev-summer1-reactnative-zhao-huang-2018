import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import CourseList from "./Components/CourseList";
import {createStackNavigator} from "react-navigation";
import ModuleList from "./Components/ModuleList";
import LessonList from "./Components/LessonList";
import WidgetList from "./Components/WidgetList";
import Assignment from "./Elements/Assignment";
import Exam from "./Elements/Exam";

const App = createStackNavigator({
    CourseList,
    ModuleList,
    LessonList,
    WidgetList,
    Assignment,
    Exam
});

export default App;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
