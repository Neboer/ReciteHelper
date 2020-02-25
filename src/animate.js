// 启动动画。接受第一个参数是当前的state，第二个是this.setstate()的函数，以便调用。
// 动画类改版一下。动画进行过程中，只有两类元素是被修改的，那就是class和元素的值。
// class和值本质上都是state的内容。所以动画本质上就是根据不同的时间setstate。
// 那么我们把这个过程抽离出来。。。。。。我们需要的只是一个手柄，以及一份指南，
// 这个指南非常厉害。指南里包括三段：init,half,end。
// 每个元素都有对应的classStatusName和value，应用动画就是让一个元素的class和value不断的改变。
// 我们创建一个类吧！注意，这个类描述了一个元素可以进行的一个动画！这个类的每一个实例对象都是一个元素的动作。
// 真正执行动画的时候，我们引入一个叫做“时间点”的概念。播放动画有三个时间点，开始、中间和结束，不同的动画对应不同的元素。
export default class Animate {
    constructor(animationType, valueStatusName, classStatusName, newValue, newClass) {
        // animationType 是动画的类型，目前我们支持两种类型的动画，一种是水平的移动那个切换效果，数字竖直移动的切换效果，一种是平假名片假名标签的转动效果
        // 支持的：right、left、down、up、clockwise、anticlockwise、
        // valueStatusName 和 classStatusName都拿出来，它们都是property的一部分！
        this.classStatusName = classStatusName;
        this.valueStatusName = valueStatusName;
        this.newValue = newValue;
        this.newClass = newClass;

        switch (animationType) {
            case "right":
                this.animation = this.straight_move("right");
                break;
            case "left":
                this.animation = this.straight_move("left");
                break;
            case "down":
                this.animation = this.straight_move("down");
                break;
            case "up":
                this.animation = this.straight_move("up");
                break;
            case "clockwise":
                this.animation = this.spin(true);
                break;
            case "anticlockwise":
                this.animation = this.spin(false);
                break;
            default:
                break;
        }
    }

    // direction: right left up down
    straight_move(direction) {
        let init = {}, half = {}, end = {};
        init[this.classStatusName] = direction;
        half[this.valueStatusName] = this.newValue;
        end[this.classStatusName] = this.newClass;

        return [init, half, end]
    }

    // clockwise true_false
    spin(clockwise) {
        let init = {}, half = {}, end = {};
        init[this.classStatusName] = clockwise ? "clockwise" : "anticlockwise";
        half[this.valueStatusName] = this.newValue;
        // 如果顺时针旋转，则说明平假变片假，新的类是竖直的。
        // 由于这里需要保持一个状态，为了确保动画在类的变换后播放完成，实际动画播放时长应该稍长于默认的切换时间（500ms）
        end[this.classStatusName] = this.newClass;
        return [init, half, end]
    }

    // 这是一个静态方法。它的作用是接受一个Animate对象的列表，然后执行其中的动画！
    static Execute(setState, animations_list) {
        for (let animation of animations_list) {
            setState(animation.animation[0]);
            setTimeout(function () {
                setState(animation.animation[1])
            },210);
            setTimeout(function () {
                setState(animation.animation[2])
            }, 460);
        }
    }
}
