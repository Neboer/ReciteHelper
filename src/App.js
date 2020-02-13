import React from 'react';
import './App.css';
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {InitAnsList, InitQuestionList, GetAnswerAndType} from "./toolbox"
import MultiSelect from "@khanacademy/react-multi-select";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {word: "?", pron: "?", pingjia: true, selectQuestionRange: ["nl","ln","gl","lg"]};
        this.nextQuesAndRender = this.nextQuesAndRender.bind(this);
        this.previousQuesAndRender = this.previousQuesAndRender.bind(this);
        this.showAnswer = this.showAnswer.bind(this);
        this.answerList = InitAnsList();
        this.questionList = InitQuestionList(this.answerList);
        this.current_question_index = 0;
    }

    componentDidMount() {
        this.renderCurrentQuestion()
    }

    renderCurrentQuestion() {
        // this.current_question_index++;
        let question = this.questionList[this.current_question_index];
        let [type, answer] = GetAnswerAndType(question, this.answerList);
        this.answer = answer;
        if (type === 1) {
            this.setState({word: question, pron: "?"})
        } else {
            this.setState({word: "?", pron: question})
        }
    }

    showAnswer() {
        if (this.state.word === "?") {
            this.setState({word: this.answer})
        } else if (this.state.pron === "?") {
            this.setState({pron: this.answer})
        }
    }


    nextQuesAndRender() {
        this.current_question_index = this.current_question_index + 1;
        this.renderCurrentQuestion();
    }

    previousQuesAndRender() {
        this.current_question_index = this.current_question_index - 1;
        this.renderCurrentQuestion();
    }

    // 设置出题范围。
    setQuestionRange() {

    }

    handleChange(selectedOption) {
        this.setState({ selectedOption });
        console.log(`Option selected:`, selectedOption);
    };

    render() {
        return (
            <div className="App">
                <div id={'head'}>
                    日语练习
                </div>
                <MultiSelect
                    options={[
                        {label: "平假名-罗马音", value: "gl"},
                        {label: "罗马音-平假名", value: "lg"},
                        {label: "片假名-罗马音", value: "nl"},
                        {label: "罗马音-片假名",value:"ln"}
                    ]}
                    selected={this.state.selectQuestionRange}
                    onSelectedChanged={selected => {this.setState({selectQuestionRange:selected})}}
                    overrideStrings={{
                        selectSomeItems: "请至少选择一个练习项目",
                        allItemsAreSelected: "已经选择全部练习项目",
                        selectAll: "选择全部"
                    }}
                    disableSearch={true}
                />
                <div id={'card'}>
                    <div onClick={this.showAnswer}>
                        <div id={"linter"}>{this.state.pingjia?"平假名":"片假名"}</div>
                        <div id={'progress'}>
                            {this.current_question_index + 1} / {this.questionList.length}
                        </div>
                        <div id={'pron'}>
                            {this.state.pron}
                        </div>
                        <div id={'word'}>
                            {this.state.word}
                        </div>
                    </div>
                    <AwesomeButton type="primary" className={'btnner'} id={'prev'}
                                   disabled={this.current_question_index === 0}
                                   onReleased={this.previousQuesAndRender}>上一个</AwesomeButton>
                    <AwesomeButton type="primary" className={'btnner'} id={'next'}
                                   disabled={this.current_question_index === this.questionList.length - 1}
                                   onReleased={this.nextQuesAndRender}>下一个</AwesomeButton>
                </div>
            </div>
        );
    }
}

//
// function App() {
//     let whole = InitAnsList();
//     let question = InitQuestionList(whole);
//     this.prop.pron = "?";
//     this.prop.word = "?";
//     let current_question_index = 0;
//     let [pos, qus] = GetAnswerAndType(question[current_question_index], whole);
//     if (pos === 0) {
//         this.prop.word = qus;
//     } else {
//         this.prop.pron = qus;
//     }
//
// }

export default App;
