# 日语练习 平假名/片假名测试练习

https://app.neboer.site

这个小测试应用是用来练习日语的五十音的。界面的截图如下。

![pratice-big.png](https://i.loli.net/2020/02/25/EeZy5GzCbrN8Vtv.png)

![pratice-focus.png](https://i.loli.net/2020/02/25/Ndj2ETDGrPRbetF.png)

# 用法

选择器组件选择测试题目类型，刷新按钮刷新题目，上一个与下一个切换题目，单击中央卡片空白处显示答案。

# 特色
- 这个小程序有丰富的css动画过渡效果，让练习的过程生动了许多。

- 在移动端和桌面端上的显示效果都非常优秀，尤其适合移动设备使用。

- 完全离线运行，程序运行过程中不需要特殊设计的后端服务器，直接编译然后serve就可以使用。

- 软件中包含四类题型，通过用户自由选择选择混合出题，考察假名-罗马音的互相转换。

- 使用React编写，动画适配性较好，并且性能很高。

- 使用各种开源组件，如awesome-button和react-multi-select，保证程序的呈现效果。

- 收录平假名、片假名和其浊音形式混合练习，保证效果。

# 存在的问题

- 动画的时序受制于CSS的实现效果和js语句的执行时间，在部分低性能设备上有可能造成动画错乱。
**如果出现这种情况，请开issue报告问题**

- 经常出现“片假名”标签在向上运动成“平假名”的时候，最上面的一条线会不可见的情况。这个问题属于玄学问题，
到底这个border宽度是1px还是2px的问题将会持续讨论……

- “平片假名”的标签的旋转并不很自然，在动画结束后有一个短短的突变，让人看起来并不很舒服。
这个问题是由writing mode导致的，我正在寻找新的解决方法，如果没有，那么只能死磕属性一点一点调了……

# 继续开发

- 准备支持浊音/轻音的开关。

- 添加作者信息等底栏。

- 优化各种显示效果。