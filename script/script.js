var iDiff = 1; //储存当前游戏难度1为简单，2为中等，3为困难
var iTime = 0; //储存时间
var iStep = 0; //储存步数
var arrPic = []; //用数组储存图片
var timer = null;
//浏览器兼容事件对象
var EventUtil = {
    addHandeler: function(element, type, handler) {
        if (element.addEventlistener) {
            element.addEventlistener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};
// dom节点加载完成后加载js
EventUtil.addHandeler(window, 'load', function() {
    initSize(); //初始化页面大小,位置
    initGame(); //初始化游戏
});
//初始化页面大小,位置
function initSize() {
    if (document.body.offsetHeight < document.documentElement.clientHeight) {
        document.body.style.height = document.documentElement.clientHeight + "px";
    }
}
//根据游戏难度初始化游戏数据
function initGame() {
    clearInterval(timer);
    iTime = 0;
    iStep = 0;
    initArr();
    shows();
    document.getElementById("time").innerText = iTime;
    document.getElementById("step").innerText = iStep;
    document.getElementsByClassName("show-img")[0].innerHTML = "<img src='./img/images" + iDiff + "/main.jpg'>";
    var oSelect = document.getElementById("choose");
    var oBtnStart = document.getElementById("start");
    EventUtil.addHandeler(oBtnStart, "click", startGame);
    EventUtil.addHandeler(oSelect, "change", function() {
        if (oSelect.value == "简单") {
            iDiff = 1;
        } else if (oSelect.value == "中等") {
            iDiff = 2;
        } else {
            iDiff = 3;
        }
        initGame(); //初始化游戏
    });
}
//初始化数组
function initArr() {
    (function() {
        for (var i = 0, len = (iDiff + 2) * (iDiff + 2); i < len; i++) {
            if (i == len - 1) {
                arrPic[i] = "";
            } else {
                arrPic[i] = i + 1;
            }
        }
    })();
}
//随机打乱数组
function ramArr() {
    var iSp = (iDiff + 2) * (iDiff + 2) - 1;
    var q;
    (function() {
        for (var i = 0; i < 3000; i++) {
            var xp = Math.random() * 4;
            if (xp < 1 && iSp >= (iDiff + 2)) {
                q = arrPic[iSp];
                arrPic[iSp] = arrPic[iSp - (iDiff + 2)];
                arrPic[iSp - (iDiff + 2)] = q;
                iSp = iSp - (iDiff + 2);
            } else if (xp >= 1 && xp < 2 && iSp < (iDiff + 2) * (iDiff + 1)) {
                q = arrPic[iSp];
                arrPic[iSp] = arrPic[iSp + (iDiff + 2)];
                arrPic[iSp + (iDiff + 2)] = q;
                iSp = iSp + (iDiff + 2);
            } else if (xp >= 2 && xp < 3 && iSp % (iDiff + 2) > 0) {
                q = arrPic[iSp];
                arrPic[iSp] = arrPic[iSp - 1];
                arrPic[iSp - 1] = q;
                iSp = iSp - 1;
            } else if (xp >= 3 && xp < 4 && iSp % (iDiff + 2) < (iDiff + 1)) {
                q = arrPic[iSp];
                arrPic[iSp] = arrPic[iSp + 1];
                arrPic[iSp + 1] = q;
                iSp = iSp + 1;
            }
        }
    })();
}
//开始游戏
function startGame() {
    clearInterval(timer);
    iTime = 0;
    iStep = 0;
    document.getElementById("time").innerText = iTime;
    document.getElementById("step").innerText = iStep;
    ramArr();
    shows(); //渲染
    addEvent();
    timer = setInterval(function() {
        iTime++;
        document.getElementById("time").innerText = iTime;
    }, 1000);
}
//点击触发的事件
function doClick() {
    var p = this.index;
    var m;
    var oLis = document.getElementsByTagName("li");
    //alert(p + " " + p + iDiff + " " + oLis[p + iDiff].innerHTML);
    if (p / (iDiff + 2) < (iDiff + 2) - 1 && oLis[p + (iDiff + 2)].innerHTML == "") {
        m = arrPic[p];
        arrPic[p] = arrPic[p + (iDiff + 2)];
        arrPic[p + (iDiff + 2)] = m;
    } else if (p >= (iDiff + 2) && oLis[p - (iDiff + 2)].innerHTML == "") {
        m = arrPic[p];
        arrPic[p] = arrPic[p - (iDiff + 2)];
        arrPic[p - (iDiff + 2)] = m;
    } else if (p % (iDiff + 2) < (iDiff + 2) - 1 && oLis[p + 1].innerHTML == "") {
        m = arrPic[p];
        arrPic[p] = arrPic[p + 1];
        arrPic[p + 1] = m;
    } else if (p % (iDiff + 2) > 0 && oLis[p - 1].innerHTML == "") {
        m = arrPic[p];
        arrPic[p] = arrPic[p - 1];
        arrPic[p - 1] = m;
    } else {
        return;
    }
    shows(); //渲染
    addEvent();
    iStep++;
    document.getElementById("step").innerText = iStep;
    judge(); //判断游戏是否结束
}
//渲染
function shows() {
    var oGameUl = document.getElementById("game-ul");
    oGameUl.innerHTML = "";
    (function() {
        for (var i = 0, len = (iDiff + 2) * (iDiff + 2); i < len; i++) {
            var oLi = document.createElement("li");
            var sNum = "";
            if (arrPic[i] < 10) {
                sNum = "0" + (arrPic[i]);
            } else {
                sNum = "" + (arrPic[i]);
            }
            if (arrPic[i] == "") {
                oLi.innerHTML = "";
            } else {
                oLi.innerHTML = "<img src='./img/images" + iDiff + "/pic_" + sNum + ".jpg'>";
            }
            oLi.index = i;
            oLi.style.width = 300 / (iDiff + 2) + "px";
            oLi.style.height = 300 / (iDiff + 2) + "px";
            oGameUl.appendChild(oLi);
        }
    })();
}
//添加点击事件
function addEvent() {
    var oLis = document.getElementsByTagName("li");
    (function() {
        for (var i = 0, len = oLis.length; i < len; i++) {
            oLis[i].style.cursor = "pointer";
            EventUtil.addHandeler(oLis[i], "click", doClick);
            EventUtil.addHandeler(oLis[i], "touchstart", doClick);
        }
    })();
}
//判断是否完成拼图
function judge() {
    for (var i = 0; i < (iDiff + 2) * (iDiff + 2) - 1; i++) {
        if (arrPic[i] != i + 1) {
            return;
        }
    }
    setTimeout(function() {
        alert("恭喜你完成了拼图，\n用时" + iTime + "秒\n步数：" + iStep + "\n真是太棒了!");
        initGame();
    }, 10);
}