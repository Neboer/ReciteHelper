import React from 'react';
import './App.css';
import './AppAnime.css';
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {GeneratePaperList} from "./toolbox"
import MultiSelect from "@khanacademy/react-multi-select";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: "?",
            pron: "?",
            pingjia: true,
            selectQuestionRange: ["pngl", "lpng", "pial", "lpia"],
            animClass: {word: "stable", pron: "stable"}
        };
        this.nextQuesAndRender = this.nextQuesAndRender.bind(this);
        this.previousQuesAndRender = this.previousQuesAndRender.bind(this);
        this.showAnswer = this.showAnswer.bind(this);
        this.changeQuestionRange = this.changeQuestionRange.bind(this);
        this.renewPage = this.renewPage.bind(this);
        this.current_question_index = 0;
        this.paperList = GeneratePaperList(this.state.selectQuestionRange)
    }

    renewPage() {
        this.current_question_index = 0;
        this.paperList = GeneratePaperList(this.state.selectQuestionRange);
        this.renderCurrentQuestion();
    }

    componentDidMount() {
        this.renderCurrentQuestion();
    }

    renderCurrentQuestion() {
        let current_problem = this.paperList[this.current_question_index];
        this.answer = current_problem.Answer;
        if (current_problem.Type === "pngl" || current_problem.Type === "pial") {
            this.setState({word: current_problem.Question, pron: "?"})
        } else {
            this.setState({word: "?", pron: current_problem.Question})
        }
        if (current_problem.Type === "pngl" || current_problem.Type === "lpng") {
            this.setState({pingjia: true})
        } else {
            this.setState({pingjia: false})
        }
    }

    showAnswer() {
        if (this.state.word === "?") {
            this.setState({word: this.answer})
        } else if (this.state.pron === "?") {
            this.setState({pron: this.answer})
        }
    }

    // 加入动画效果
    nextQuesAndRender() {
        // 判断哪个元素需要运动
        let updater = {word: "next", pron: "next"};
        if (this.state.word === "?" || this.state.pron === "?") {
            // 没有显示答案
            let t = this.paperList[this.current_question_index].Type;
            this.current_question_index = this.current_question_index + 1;
            let d = this.paperList[this.current_question_index].Type;
            let his_qm_pos = t === "pngl" || t === "pial"; // pron是?
            let fur_qm_pos = d === "pngl" || d === "pial";
            if (his_qm_pos === fur_qm_pos) {
                // 两次问号出现的位置相同 均是true，只更新word，均是false，只更新pron
                updater = {word: his_qm_pos ? "next" : "stable", pron: !his_qm_pos ? "next" : "stable"}
            }
        } else {
            this.current_question_index = this.current_question_index + 1;
        }
        this.setState({animClass: updater});
        setTimeout(function () {
            this.renderCurrentQuestion();
        }.bind(this), 250);
        setTimeout(function () {
            this.setState({animClass: {word: "stable", pron: "stable"}})
        }.bind(this), 500)
    }

    previousQuesAndRender() {
        let updater = {word: "prev", pron: "prev"};
        // 判断哪个元素需要运动
        if (this.state.word === "?" || this.state.pron === "?") {
            let t = this.paperList[this.current_question_index].Type;
            this.current_question_index = this.current_question_index - 1;
            let d = this.paperList[this.current_question_index].Type;
            let his_qm_pos = t === "pngl" || t === "pial"; // pron是?
            let fur_qm_pos = d === "pngl" || d === "pial";
            if (his_qm_pos === fur_qm_pos) {
                // 两次问号出现的位置相同 均是true，只更新word，均是false，只更新pron
                updater = {word: his_qm_pos ? "prev" : "stable", pron: !his_qm_pos ? "prev" : "stable"}
            }
        } else {
            this.current_question_index = this.current_question_index + 1;
        }
        this.setState({animClass: updater});
        setTimeout(function () {
            this.renderCurrentQuestion();
        }.bind(this), 250);
        setTimeout(function () {
            this.setState({animClass: {word: "stable", pron: "stable"}})
        }.bind(this), 500)
    }

    changeQuestionRange(selected_range) {
        if (selected_range.length > 0) {
            this.answer = "";
            this.current_question_index = 0;
            this.setState({word: "", pron: ""});
            this.setState({selectQuestionRange: selected_range}, () => {
                this.paperList = GeneratePaperList(this.state.selectQuestionRange);
                this.renderCurrentQuestion();
            });
        }
    }

    render() {
        return (
            <div className="App">
                <div id={'head'}>
                    日语练习
                    <MultiSelect
                        options={[
                            {label: "平假名-罗马音", value: "pngl"},
                            {label: "罗马音-平假名", value: "lpng"},
                            {label: "片假名-罗马音", value: "pial"},
                            {label: "罗马音-片假名", value: "lpia"}
                        ]}
                        selected={this.state.selectQuestionRange}
                        onSelectedChanged={this.changeQuestionRange}
                        overrideStrings={{
                            selectSomeItems: "请至少选择一个练习项目",
                            allItemsAreSelected: "已经选择全部练习项目",
                            selectAll: "选择全部"
                        }}
                        disableSearch={true}
                    />
                    <img src={'./reload.svg'} alt={'good'} className={'reload'} onClick={this.renewPage}/>
                </div>

                <div id={'card'}>
                    <div onClick={this.showAnswer}>
                        <div id={"linter"}>{this.state.pingjia ? "平假名" : "片假名"}</div>
                        <div id={'progress'}>
                            {this.current_question_index + 1} / {this.paperList.length}
                        </div>
                        <div id={'pron'} className={this.state.animClass.pron}>
                            {this.state.pron}
                        </div>
                        <div id={'word'} className={this.state.animClass.word}>
                            {this.state.word}
                        </div>
                    </div>
                    <AwesomeButton type="primary" className={'btnner'} id={'prev'}
                                   disabled={this.current_question_index === 0}
                                   onReleased={this.previousQuesAndRender}>上一个</AwesomeButton>
                    <AwesomeButton type="primary" className={'btnner'} id={'next'}
                                   disabled={this.current_question_index === this.paperList.length - 1}
                                   onReleased={this.nextQuesAndRender}>下一个</AwesomeButton>
                </div>
            </div>
        );
    }
}

export default App;
