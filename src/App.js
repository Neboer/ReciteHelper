import React from 'react';
import './App.css';
import './AppAnime.css';
import {AwesomeButton} from "react-awesome-button";
import "react-awesome-button/dist/styles.css";
import {GeneratePaperList} from "./toolbox"
import Animate from "./animate"
import MultiSelect from "@khanacademy/react-multi-select";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            word: "?",
            romanji: "?",
            index: 1,
            // 平假名还是片假名，暂时还不知道，所以打上unknown以做出区分。
            tag: "unknown",
            // 题目分类："2/4"是"平假名/片假名"，"y/z"代表考音还是考字
            selectQuestionRange: ["2y", "2z", "4y", "4z"],
            // 这些是类名。
            cls_word: "stable",
            cls_romanji: "stable",
            cls_index: "stable",
            // 平假名还是片假名，在创建的时候还不知道，所以打上unknown，在接下来的setstate中可以决定。
            cls_tag: "unknown"
        };
        this.animateToggleRender = this.animateToggleRender.bind(this);
        this.previous = this.previous.bind(this);
        this.next = this.next.bind(this);
        this.showAnswer = this.showAnswer.bind(this);
        this.changeQuestionRange = this.changeQuestionRange.bind(this);
        this.renewPage = this.renewPage.bind(this);
        this.current_question_index = 0;
        this.paperList = GeneratePaperList(this.state.selectQuestionRange);
        this.answerShown = false
    }

    renewPage() {
        this.current_question_index = 0;
        this.paperList = GeneratePaperList(this.state.selectQuestionRange);
        this.renderInitialView();
    }

    componentDidMount() {
        this.renderInitialView();
    }

    renderInitialView() {
        // 初始化元素值。
        let question = this.paperList[this.current_question_index];
        // 第一个问题，index = 1
        this.setState({index: 1});
        // 判断是否为考音问题
        if (question.Type[1] === "y") {
            // 考音，那么pron为问号。
            this.setState({word: question.Question, romanji: "?"})
        } else {
            this.setState({word: "?", romanji: question.Question})
        }

        if (question.Type[0] === "2") {
            // 平假名，那么渲染平假名的标签。
            this.setState({tag: "平假名", cls_tag: "horizontal"})
        } else {
            this.setState({tag: "片假名", cls_tag: "vertical"})
        }
    }

    showAnswer() {
        let answer = this.paperList[this.current_question_index].Answer;
        if (!this.answerShown) {
            if (this.state.word === "?") {
                this.setState({word: answer})
            } else if (this.state.romanji === "?") {
                this.setState({romanji: answer})
            }
        }
        this.answerShown = true;
    }

    // 带有动画特效地渲染和执行，实际上是nextQuestion和prevQuestion抽象出来的函数。
    animateToggleRender(direction) { // 需要传入next或者prev，作为更新视图的“direction”。
        let old_index = this.current_question_index;// 为了避免引起误解，重新命名“current index”
        // 这里的index太多了，这一点实在是艹。为了便于区分，我们把它们命个名：忽略current_question_index，old_index是在按下按钮前题目位置指示器的值。
        let new_question_index, main_movement_direction, index_movement_direction; // main和index是由传入的direction决定的，所以直接一起渲染好。视图index也是如此
        if (direction === "next") {
            // 不要被这个new_question_index迷惑了！这个index仅仅是一个临时用的方便值，是和题目指示器有关系的，和真正的在网页上的index视图指示器没有半毛钱关系！！！！
            // 但是指示器又确实使用了new_question_index的值，因为方便！！！！
            new_question_index = this.current_question_index + 1;
            main_movement_direction = "right";
            index_movement_direction = "down"
        } else {
            new_question_index = this.current_question_index - 1;
            main_movement_direction = "left";
            index_movement_direction = "up"
        }
        let old_question = this.paperList[old_index];
        let new_question = this.paperList[new_question_index];
        let all_animation_list = [];
        // 在总体判断是否运动之前，先考虑一下word和romanji哪个将会是问号，并得到每个新元素的内容。
        let new_type = new_question.Type;
        let new_word = (new_type[1] === "y") ? new_question.Question : "?";
        let new_romanji = (new_type[1] === "y") ? "?" : new_question.Question;
        // 新的问题是平假名问题还是片假名问题不必在这里判断，因为接下来会判断的。
        let wordAnimation, romanjiAnimation, indexAnimation, tagAnimation;
        // 注意这里的判断是否需要运动。word和romanji都是有可能不运动的，因此我们采取了直接判断法，在上面已经计算出的word/romanji的新的视图值之后，判断这个是否需要运动，可谓是非常高效。
        // 判断word是否需要运动。
        if (this.state.word !== new_word) {
            wordAnimation = new Animate(main_movement_direction, "word", "cls_word", new_word, "stable");
            all_animation_list.push(wordAnimation);
        }
        // 判断romanji是否需要运动
        if (this.state.romanji !== new_romanji) {
            romanjiAnimation = new Animate(main_movement_direction, "romanji", "cls_romanji", new_romanji, "stable");
            all_animation_list.push(romanjiAnimation);
        }
        // 这里的index + 1是因为new_question_index是从0开始计数的。
        indexAnimation = new Animate(index_movement_direction, "index", "cls_index", new_question_index + 1, "stable");
        all_animation_list.push(indexAnimation);
        // 判断tag是否需要运动，注意这里的tag是需要我们自己判断运动方向的。如果不需要运动，那就不运动。
        if (new_question.Type[0] !== old_question.Type[0]) {
            if (new_type[0] === "4") {
                // 新的题目是片假名题，需要顺时针转下来
                tagAnimation = new Animate("clockwise", "tag", "cls_tag", "片假名", "vertical");
            } else {
                tagAnimation = new Animate("anticlockwise", "tag", "cls_tag", "平假名", "horizontal")
            }
            all_animation_list.push(tagAnimation);
        }

        // 然后把工具函数和动画方案传过去，执行动画！
        Animate.Execute(this.setState.bind(this), all_animation_list);
        // 将我们用来方便自己的变量都按照要求变化回去。
        this.answerShown = false;
    }

    previous() {
        this.animateToggleRender("prev");
        this.current_question_index--
    }

    next() {
        this.animateToggleRender("next");
        this.current_question_index++;
    }

    changeQuestionRange(selected_range) {
        if (selected_range.length > 0) {
            this.current_question_index = 0;
            this.setState({selectQuestionRange: selected_range}, () => {
                this.paperList = GeneratePaperList(this.state.selectQuestionRange);
                this.answerShown = false;
                this.renderInitialView();
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
                            {label: "平假名-罗马音", value: "2y"},
                            {label: "罗马音-平假名", value: "2z"},
                            {label: "片假名-罗马音", value: "4y"},
                            {label: "罗马音-片假名", value: "4z"}
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
                        <div id={"tag"} className={this.state.cls_tag}>{this.state.tag}</div>
                        <div id={'progress'}>
                            <strong style={{display: "inline-block"}}
                                    className={this.state.cls_index}>{this.state.index}</strong> / {this.paperList.length}
                        </div>
                        <div id={'romanji'} className={this.state.cls_romanji}>
                            {this.state.romanji}
                        </div>
                        <div id={'word'} className={this.state.cls_word}>
                            {this.state.word}
                        </div>
                    </div>
                    <AwesomeButton type="primary" className={'btnner'} id={'prev'}
                                   disabled={this.current_question_index === 0}
                                   onReleased={this.previous}>上一个</AwesomeButton>
                    <AwesomeButton type="primary" className={'btnner'} id={'next'}
                                   disabled={this.current_question_index === this.paperList.length - 1}
                                   onReleased={this.next}>下一个</AwesomeButton>
                </div>
            </div>
        );
    }
}

export default App;
