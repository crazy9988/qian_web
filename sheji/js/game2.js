var classNum = [1,2,3,4,5,6,7,8,9];
var classArr = new Array();
function game(nan){
  classNum.sort(function(){ return Math.random()>0.5?-1:1; });//打乱数字；
  for(i=0;i<9;i+=3){
   classArr[i/3] = classNum.slice(i,i+3);
  }
  var S = new Array();
  S[0] = new Array();
  for(i=0;i<3;i++){
   classArr.unshift(classArr.pop());
   S[0][i]=new Array();
   S[0][i]=classArr.slice(0,4);
  }
  for(i=1;i<3;i++){
   S[i] = new Array();
   for(m=0;m<3;m++){
    S[i][m] = new Array();
    for(n=0;n<3;n++){
     var _arr = S[i-1][m][n].slice(0,4);
     _arr.unshift(_arr.pop());
     S[i][m][n] = _arr;
    }
   }
  }
  var c = S.toString().replace(/(\d),/g,function(){
       var e=arguments[1];
	   e = Math.random()>nan?e:'<input type="text" rel='+e+' maxlength="1" />';
	   return e+"</li><li>";
   });
  ul.innerHTML="";
  ul.innerHTML="<li>"+c+"</li>";
}
function check(){
 var lis = ul.getElementsByTagName('li');
 var i=0,li,err=false;
 while(li=lis[i]){
    li = li.firstChild;
    if(err)return;
   if(li.nodeType!=3){
   var value = li.value;
   if(value=='' || value == ' '){alert('未填写完整，失败！\n重来！');Reset();return;}
    if(parseInt(value)!=parseInt(li.getAttribute('rel'))){
	 var heng = parseInt(i/9);
	 for(j=heng*9;j<(heng+1)*9;j++){
	   var tli = lis[j].nodeType==3?lis[j].innerHTML:lis[j].firstChild.value;
	   tli = parseInt(tli);
	   if(parseInt(value)==tli && i!=j){
	   li.parentNode.className = 'err';
	   lis[j].className = 'err';
	   err = true;
	  }
	 }
	 for(j=i%9;j<81;j+=9){
	   var tli = lis[j].nodeType==3?lis[j].innerHTML:lis[j].firstChild.value;
	  tli = parseInt(tli);
	   if(parseInt(value)==tli && i!=j){
	   li.parentNode.className = 'err';
	   lis[j].className = 'err';
	   err = true;
	   }
	  }
	  if(err){alert('出错了，失败！\n重新开始！');Reset();return;}
	 }
   }
   i++;
 }
 alert('恭喜您得了满分！\n继续！');
 Reset();
}
function daan(){
 var lis = ul.getElementsByTagName('input');
 var i=0,li;
 while(li=lis[i]){
   li.value=li.getAttribute('rel');
   i++;
 }
}
function Reset(){
 var nan=document.getElementById('nan');
 game(Number(nan.options[nan.selectedIndex].value));
}
var div,ul;
window.onload=function (){
div=document.createElement("div");
div.setAttribute("id","gong");
ul = document.createElement("ul");
div.appendChild(ul);
document.getElementById('d').appendChild(div);
 game(0.65);
}