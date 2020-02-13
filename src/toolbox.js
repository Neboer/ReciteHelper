import SOR from "./nihongjin.json"

export function InitAnsList() {
    return SOR
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export function InitQuestionList(ans_list) {
    let que_list = [];
    for (let i = 0; i <= ans_list.length - 1; i++) {
        que_list.push(ans_list[i][0], ans_list[i][1])
    }
    return shuffle(que_list)
}

export function GetAnswerAndType(item, ans_list) {
    for (let i of ans_list) {
        if (i[0] === item) {
            return [0, i[1]]
        } else if (i[1] === item) {
            return [1, i[0]]
        }
    }
}