import SOR from "./nihongjin.json"

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

/**
 *
 * @param selectQuestionRange ["2y,"2z,"4y,"4z]
 * @constructor
 * @return []{Type:"2y,Question:"あ",Answer:"a"}
 */
export function GeneratePaperList(selectQuestionRange) {
    let png = [];
    let pia = [];
    let luo = [];
    let FinalList = [];
    for(let lis of SOR){
        png.push(lis[1]);
        pia.push(lis[2]);
        luo.push(lis[0]);
    }
    if (selectQuestionRange.includes("2y")){
        for(let index in png){
            if(png.hasOwnProperty(index)){
                FinalList.push({Type: "2y",Question:png[index],Answer:luo[index]})
            }
        }
    }    if (selectQuestionRange.includes("2z")){
        for(let index in luo){
            if(luo.hasOwnProperty(index)){
                FinalList.push({Type: "2z",Question:luo[index],Answer:png[index]})
            }
        }
    }    if (selectQuestionRange.includes("4y")){
        for(let index in pia){
            if(pia.hasOwnProperty(index)){
                FinalList.push({Type: "4y",Question:pia[index],Answer:luo[index]})
            }
        }
    }    if (selectQuestionRange.includes("4z")){
        for(let index in luo){
            if(luo.hasOwnProperty(index)){
                FinalList.push({Type: "4z",Question:luo[index],Answer:pia[index]})
            }
        }
    }
    shuffle(FinalList);
    return FinalList
}
