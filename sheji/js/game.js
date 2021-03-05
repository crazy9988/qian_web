
var $ = function(id){return document.getElementById(id)};
var minesweeper = {};//雷区对象
var mineArray = [];//地雷组
var _differendNumber = null;//生成不同位置的随机地雷
var overcomeMineLenth = {overcome:0, minelength:10};
var bumpBOx = {mousekey:0,bump:null}//用于判断左右键双击
function CreateBox(y,x,mine){//构造雷格对象
	this.position = 1;//1在雷区里面，0不在
	this.y = y;
	this.x = x;
	this.mine = mine;  //1有雷，0无
	this.on = 0;//0未扫，1已扫，2已标记
	this.t_l = {y:y-1, x:x-1}; //左上格子坐标
	this.t_c = {y:y-1, x:x};//上
	this.t_r = {y:y-1, x:x+1};//右上
	this.b_l = {y:y+1, x:x-1};//左下
	this.b_c = {y:y+1, x:x};//下
	this.b_r = {y:y+1, x:x+1};//右下
	this.l   = {y:y, x:x-1};//左
	this.r   = {y:y, x:x+1};//右
}
function getMineSweeper(){
	var oCount = parseInt($('oCount').innerHTML);
	var y, x, max, boxslist=[],has=[];
	switch(oCount){//取得雷区长宽
		case 10: y = 9; x = 9;
		break;
		case 40: y = 16; x = 16;
		break;
		case 99: y = 16; x = 30;
		break;
	}
	max = y*x;
	$('oMain').style.width = 24*x+2+'px';
	for(var i=0; i<y; i++){//生成格子
	    boxslist[i] = [];
		for(var j=0; j<x; j++){
			boxslist[i].push(new CreateBox(i,j,0));
		}
	}
	for(var k=0; k<oCount; k++){//生成随机雷格数组序号
	    var new_num = Math.floor(Math.random()*max+1);
	    getDifferentNumber(new_num,has,max);
	    new_num = _differendNumber;
	    has.push(new_num);
	}
	function setMine(arr){
        for(var i=0; i<has.length; i++){
            var mineX = arr[i] % x == 0 ? x : arr[i] % x;
            var mineY = Math.ceil(arr[i] / x);
            boxslist[mineY-1][mineX-1].mine = 1;
        }
    }
    mineArray = has;
    overcomeMineLenth.minelength = mineArray.length;
    setMine(has);
	function getDifferentNumber(n,has,max){//生成不重复的随机数
	    var _has = has;
	    var _max = max;
	    var _n = n;
	    var isin = 0;
	    for(var i=0; i<_has.length; i++){
	        if(_n==has[i]){
	           isin = 1;
	        }
	    }
	    if(isin==1){ //如果相同，递归执行
	        var _num = Math.floor(Math.random()*_max+1);
	        arguments.callee(_num,_has,_max);
	    }else{
	        _differendNumber = _n;
	    }
	}
	minesweeper.len = max;
	minesweeper.x = x;
	minesweeper.y = y;
    minesweeper.boxslist = boxslist;//雷格数组
}
function mineSweeperToHTML(obj){//布雷到页面HTML
     var x_len = obj.x;
     var y_len = obj.y;
     var arr = obj.boxslist;
     var str = '';
     for(var i=0; i<arr.length; i++){
         var _tr = '<tr>';
         for(var j=0; j<arr[i].length; j++){
             var id = 'box-' + i + '-' + j ;
             var _mineclass = 'hidden';
             _tr += '<td id="' + id + '" class="' + _mineclass + '">&nbsp;<\/td>';
         }
         _tr += '<\/tr>';
         str += _tr ;
     }
     $('mineField').innerHTML = '<table>' + str + '<\/table>';
     //添加事件
     var boxs = $('mineField').getElementsByTagName('td');
     var len = boxs.length;
     for(var k=0; k<len; k++){
         boxs[k].onclick = function(){
             mineBoxClick(this);
         }
         boxs[k].onmousedown = function(event){
             addFlag(this,event);
         }
         boxs[k].onmouseup = function(event){
             leftRightMouseUp();
         }
     }
}
function mineBoxClick(ele){//格子点击
    var ele_id = ele.getAttribute('id');
    var ele_id_arr = ele_id.split('-');
    var y = parseInt(ele_id_arr[1]);
    var x = parseInt(ele_id_arr[2]);
    var box = minesweeper.boxslist[y][x];
    var eleclass = ele.getAttribute('class');
    if(eleclass!='hidden'){return false;}//如果已经点击，返回false
    // var ele = $('box-'+y+'-'+x);
    box.on = 1;
    if(box.mine==0){//不是雷
        overcomeMineLenth.overcome += 1;
        var tl,tc,tr,bl,bc,br,l,r;  //获取周围的格子对象
        var out = {position:0, mine:0};
        var maxY = minesweeper.y - 1;
        var maxX = minesweeper.x - 1;
        if(box.t_l.y < 0 || box.t_l.y > maxY || box.t_l.x < 0 || box.t_l.x > maxX){
            tl = out ;
        }else{
            tl = minesweeper.boxslist[box.t_l.y][box.t_l.x];
        }
        if(box.t_c.y < 0 || box.t_c.y > maxY || box.t_c.x < 0 || box.t_c.x > maxX){
            tc = out ;
        }else{
            tc = minesweeper.boxslist[box.t_c.y][box.t_c.x];
        }
        if(box.t_r.y < 0 || box.t_r.y > maxY || box.t_r.x < 0 || box.t_r.x > maxX){
            tr = out ;
        }else{
            tr = minesweeper.boxslist[box.t_r.y][box.t_r.x];
        }
        if(box.b_l.y < 0 || box.b_l.y > maxY || box.b_l.x < 0 || box.b_l.x > maxX){
            bl = out ;
        }else{
            bl = minesweeper.boxslist[box.b_l.y][box.b_l.x];
        }
        if(box.b_c.y < 0 || box.b_c.y > maxY || box.b_c.x < 0 || box.b_c.x > maxX){
            bc = out ;
        }else{
            bc = minesweeper.boxslist[box.b_c.y][box.b_c.x];
        }
        if(box.b_r.y < 0 || box.b_r.y > maxY || box.b_r.x < 0 || box.b_r.x > maxX){
            br = out ;
        }else{
            br = minesweeper.boxslist[box.b_r.y][box.b_r.x];
        }
        if(box.l.y < 0 || box.l.y > maxY || box.l.x < 0 || box.l.x > maxX){
            l = out ;
        }else{
            l = minesweeper.boxslist[box.l.y][box.l.x];
        }
        if(box.r.y < 0 || box.r.y > maxY || box.r.x < 0 || box.r.x > maxX){
            r = out ;
        }else{
            r = minesweeper.boxslist[box.r.y][box.r.x];
        }
        var round = tl.mine + tc.mine + tr.mine + bl.mine + bc.mine + br.mine + l.mine + r.mine;
        switch(round){  //周围格子元素样式设置
            case 8:ele.setAttribute('class','on8');ele.innerHTML = 8 ;
            break;
            case 7:ele.setAttribute('class','on7');ele.innerHTML = 7 ;
            break;
            case 6:ele.setAttribute('class','on6');ele.innerHTML = 6 ;
            break;
            case 5:ele.setAttribute('class','on5');ele.innerHTML = 5 ;
            break;
            case 4:ele.setAttribute('class','on4');ele.innerHTML = 4 ;
            break;
            case 3:ele.setAttribute('class','on3');ele.innerHTML = 3 ;
            break;
            case 2:ele.setAttribute('class','on2');ele.innerHTML = 2 ;
            break;
            case 1:ele.setAttribute('class','on1');ele.innerHTML = 1 ;
            break;
            default:
            ele.setAttribute('class','on');     //如果有空格，继续搜索
            if(tl.position!=0 && tl.on==0) {$('box-' + tl.y + '-' + tl.x).click()}
            if(tc.position!=0 && tc.on==0) {$('box-' + tc.y + '-' + tc.x).click()}
            if(tr.position!=0 && tr.on==0) {$('box-' + tr.y + '-' + tr.x).click()}
            if(bl.position!=0 && bl.on==0) {$('box-' + bl.y + '-' + bl.x).click()}
            if(bc.position!=0 && bc.on==0) {$('box-' + bc.y + '-' + bc.x).click()}
            if(br.position!=0 && br.on==0) {$('box-' + br.y + '-' + br.x).click()}
            if(l.position!=0 && l.on==0) {$('box-' + l.y + '-' + l.x).click()}
            if(r.position!=0 && r.on==0) {$('box-' + r.y + '-' + r.x).click()}
            break;
        }
        if(overcomeMineLenth.overcome+overcomeMineLenth.minelength == minesweeper.len){
            alert('恭喜，你赢了！');
            $('start').onclick();
        }
    }else{  //是雷
        for(var i=0; i<mineArray.length; i++){
            var mineElement = $('mineField').getElementsByTagName('td');
            mineElement[mineArray[i]-1].setAttribute('class','mine');
        }
        ele.setAttribute('class','boom');
        $('start').setAttribute('src','sad.gif');
        //移除添加事件
         var boxs2 = $('mineField').getElementsByTagName('td');
         var len = boxs2.length;
         for(var k=0; k<len; k++){
             boxs2[k].onclick = function(){
                 return false;  //mineBoxClick(this);
             }
             boxs2[k].onmousedown = function(event){
                 return false;  //addFlag(this,event);
             }
             boxs2[k].onmouseup = function(event){
             	return false;	//leftRightMouse(this,event);
         	}
         }
    }
}
function addFlag(ele,event){    //右键标记红旗
    var e = event || window.event;
    var _c = ele.getAttribute('class');
    // alert(event.button);
    if(e.button==2){
    	bumpBOx.mousekey += 2;
    }
    if(e.button!=2){	//左右键
    	bumpBOx.mousekey += 1;
    }
    // console.log(bumpBOx.mousekey);
    switch(bumpBOx.mousekey){
    	case 2:
    	if(_c=='hidden'){
            ele.setAttribute('class','flag');
            $('oCount').innerHTML = parseInt($('oCount').innerHTML) - 1;
        }else if(_c=='flag'){
            ele.setAttribute('class','hidden');
            $('oCount').innerHTML = parseInt($('oCount').innerHTML) + 1;
        }else{
            return false;
        }
        break;
        case 3:
        switch (_c){
    		case 'hidden' :
    		case 'flag' :
    		case 'on' :
    		case '' :
    		return false;
    		break;
    		default:
    		leftRightMouseShow(ele);
    		break;
    	}
    	break;
    	default:
    	return false;
    	break;
    }
}
function leftRightMouseUp(){
	bumpBOx.mousekey = 0;
}
function leftRightMouseShow(ele){	//左右键双击效果
	function getFlag(obj){
		if(obj){
			if(obj.getAttribute('class')=='flag'){
				return 1;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	}
	function isClick(ele){
		if(ele){
			ele.click();
		}else{
			return false;
		}
	};
	var ele_id = ele.getAttribute('id');
    var ele_id_arr = ele_id.split('-');
    var y = parseInt(ele_id_arr[1]);
    var x = parseInt(ele_id_arr[2]);
    //var tl,tc,tr,bl,bc,br,l,r;
    //var out = {position:0, mine:0};
    //获取周围的格子对象
    var tl = $('box-'+(y-1)+'-'+(x-1));
    var tc = $('box-'+(y-1)+'-'+x);
    var tr = $('box-'+(y-1)+'-'+(x+1));
    var bl = $('box-'+(y+1)+'-'+(x-1));
    var bc = $('box-'+(y+1)+'-'+x);
    var br = $('box-'+(y+1)+'-'+(x+1));
    var l = $('box-'+y+'-'+(x-1));
    var r = $('box-'+y+'-'+(x+1));
    var _flag = getFlag(tl) +
    			getFlag(tc) +
    			getFlag(tr) +
    			getFlag(bl) +
    			getFlag(bc) +
    			getFlag(br) +
    			getFlag(l) +
    			getFlag(r) ;
    if(ele.innerHTML == _flag){
    	isClick(tl);
    	isClick(tc);
    	isClick(tr);
    	isClick(bl);
    	isClick(bc);
    	isClick(br);
    	isClick(l);
    	isClick(r);
    }else{
    	var roundArr = [tl,tc,tr,bl,bc,br,l,r];
    	showDown(roundArr);
    }
}
//凹陷效果
function showDown(arr){
	var len = arr.length;
	bumpBOx.bump = arr;
	for(var i=0; i<len; i++){
		if(arr[i]){
			var _c = arr[i].getAttribute('class');
			if(_c=='hidden'){
				arr[i].setAttribute('class','onbump');
			}
		}
	}
	setTimeout("backClass(bumpBOx.bump)",100);
}
function backClass(arr){
	var len = arr.length;
	for(var i=0; i<len; i++){
			if(arr[i]){
				var _c = arr[i].getAttribute('class');
				if(_c=='onbump'){
					arr[i].setAttribute('class','hidden');
				}
			}
		}
}
function startGame(){   //开始游戏
    getMineSweeper();
    mineSweeperToHTML(minesweeper);
	overcomeMineLenth.overcome = 0;
}
function chooseDifficulty (){   //难度选择
    var arr = document.getElementsByName('radio');
    var len = arr.length;
    for(var i=0; i<len; i++){
	arr[i].onclick = function(){
	$('oCount').innerHTML = this.value;
	$('start').setAttribute('src','/jscode//demoimg/201209/happy.gif');
	startGame();
	}
    }
}
function getDifficulty(){   //获取已选难度
    var arr = document.getElementsByName('radio');
    var len = arr.length;
    for(var i=0; i<len; i++){
        if(arr[i].checked){
            $('oCount').innerHTML = arr[i].value;
        }
    }
}
window.onload = function(){
    chooseDifficulty ()
    startGame();
    $('start').onclick = function(){
		this.setAttribute('src','happy.gif');
		getDifficulty();
		startGame();
    }
	$('oMain').style.display = 'block';
	$('loading').style.display = 'none';
    document.oncontextmenu = function(){ return false;}
    document.onselectstart =  function(){ return false;}
}
//第二个游戏
var cards = new Array(6);
var play = 0;
var cn = 0;
var ttl = 0;
cards[1] = "        CARD  ONE        \n  1  3  5  7  9 11 13 15 \n 17 19 21 23 25 27 29 31 \n 33 35 37 39 41 43 45 47 \n 49 51 53 55 57 59 61 63";
cards[2] = "        CARD  TWO        \n  2  3  6  7 10 11 14 15 \n 18 19 22 23 26 27 30 31 \n 34 35 38 39 42 43 46 47 \n 50 51 54 55 58 59 62 63";
cards[3] = "       CARD  THREE       \n  4  5  6  7 12 13 14 15 \n 20 21 22 23 28 29 30 31 \n 36 37 38 39 44 45 46 47 \n 52 53 54 55 60 61 62 63";
cards[4] = "        CARD FOUR        \n  8  9 10 11 12 13 14 15 \n 24 25 26 27 28 29 30 31 \n 40 41 42 43 44 45 46 47 \n 56 57 58 59 60 61 62 63";
cards[5] = "        CARD FIVE        \n 16 17 18 19 20 21 22 23 \n 24 25 26 27 28 29 30 31 \n 48 49 50 51 52 53 54 55 \n 56 57 58 59 60 61 62 63";
cards[6] = "        CARD  SIX        \n 32 33 34 35 36 37 38 39 \n 40 41 42 43 44 45 46 47 \n 48 49 50 51 52 53 54 55 \n 56 57 58 59 60 61 62 63";
var ccol = new Array("","#FF7777","Green","Blue","Gray","Red","Black");
var knos = new Array("",1,2,4,8,16,32);
function Nextcard() {
cn++;
if(cn == 7)
End();
else {
document.x.card.value=cards[cn];
document.x.card.style.backgroundColor=ccol[cn];
document.x.text.value="你想的数字在上面吗？";
   }
}
function Restart() {
play=0;
cn=0;
ttl=0;
document.x.card.style.backgroundColor = "#FFFFFF";
document.x.card.style.color = "#000000";
document.x.card.value = "请设置一个数字（0到63之间的数），然后开始，按照提示作相应问答，系统就能猜出那个数.";
document.x.text.value = "按开始键";
document.x.stbt.value = "开始";
}
function Yes() {
ttl = ttl + knos[cn];
Nextcard();
}
function Start() {
document.x.card.style.color = "White";
document.x.stbt.value = "重新开始";
play = 1;
Nextcard();
}
function End() {
play = 2;
if(ttl < 10)
ttl = " " + ttl;
ttl = " " + ttl;
var one = ttl.charAt(1);
var two = ttl.charAt(2);
document.x.card.value = "\n   你想的那个数字是 :    \n      -- [ "+one+" "+two+" ] --";
document.x.card.style.color = "Red";
document.x.text.value = "按开始键重新开始";
}
function click() {
event.cancelBubble = true;
event.returnValue = false;
}
document.oncontextmenu = click;