
    // 加载留言信息
    var loadMsg = function()
    {
        var tb = document.getElementById("show");
        // 清空原来显示的内容。
        tb.innerHTML = "";
        // 遍历所有留言信息
        for(var i = 0 ; i < localStorage.length ; i++)
        {
            var key = localStorage.key(i);
            var date = new Date();
            date.setTime(key);
            // 获取留言时间
            var datestr = date.toLocaleDateString()
                    + " " + date.toLocaleTimeString();
            // 获取留言内容
            var value = localStorage.getItem(key);
            var row = tb.insertRow(i);
            // 添加第一个单元格，并显示留言内容
            row.insertCell(0).innerHTML = value;
            // 添加第二个单元格，并显示留言内容。
            row.insertCell(1).innerHTML = datestr;
        }
    }
    var addMsg = function()
    {
        var msgElement = document.getElementById("msg");
        var time = new Date().getTime();
        // 以当前时间为key来保存留言信息
        localStorage.setItem(time , msgElement.value);
        msgElement.value = "";
        alert("数据已保存。");
        loadMsg();
    }
    function clearMsg()
    {
        // 清空Local Storage里保存的数据。
        localStorage.clear();
        alert("全部留言信息已被清除。");
        loadMsg();
    }
    window.onload = loadMsg();
