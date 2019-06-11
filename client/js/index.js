if (document.getElementById("btn_register")) {
  document.getElementById('btn_register').onclick = async () => {
    console.log("in btn_register click");

    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;
    let re_pass = document.getElementById('re_pass').value;
    if (!name) {
      return alert("请输入用户名");
    }
    if (!pass) {
      return alert("请输入密码");
    }
    if (!re_pass) {
      return alert("请输入确认密码");
    }
    if (pass != re_pass) {
      return alert("两次输入的密码不一致");
    }
    let data = await common_fetch('/user/register', { name, pass, re_pass });
    if (data && data.hasError) {
      //出现了错误
      return alert('注册出现了错误,请稍微重试');
    }
    console.log("data===>", data);
    if (data && data.data.userInfo) {
      localStorage.setItem('user_info', JSON.stringify(data.data.userInfo))
    }
    alert('注册成功!!');
    //跳转到首页
    window.location.href = '/index.html';
  }
}

if (document.getElementById("btn_login")) {
  document.getElementById('btn_login').onclick = async () => {
    console.log("in btn_login click");
    let name = document.getElementById('name').value;
    let pass = document.getElementById('pass').value;
    if (!name) {
      return alert("请输入用户名");
    }
    if (!pass) {
      return alert("请输入密码");
    }
    let data = await common_fetch('/user/login', { name, pass });
    if (data && data.hasError) {
      //出现了错误
      return alert('登录失败,请检查你的用户名和密码');
    }
    console.log("btn_login data==>", data);

    if (data && data.data && data.data.userInfo) {
      localStorage.setItem('user_info', JSON.stringify(data.data.userInfo))
    }
    alert('登录成功!!');
    //跳转到首页
    window.location.href = '/index.html';
  }
}


//通用fetch
common_fetch = async (url, postData) => {
  let response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });
  let data = response.json();
  console.log("common_fetch data==>", data);
  return data;
}

common_gql_fetch = async (queryStr, variables, operationName) => {
  let response = await fetch('/graphql?', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: operationName,
      query: queryStr,
      variables
    })
  });
  let data = response.json();
  console.log("common_gql_query_fetch data==>", data);
  return data;
}

common_gql_mutation_fetch = async (mutationStr, variables) => {
  let response = await fetch('/graphql?', {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      operationName: null,
      query: queryStr,
      variables
    })
  });
  let data = response.json();
  console.log("common_gql_query_fetch data==>", data);
  return data;
}

common_time_opt = (timespan) => {
  let now = Date.now();
  console.log(now, timespan);

  if ((now - timespan) < 1 * 60 * 1000) {
    //如果小于一分钟 则显示多少秒钱
    return Math.floor((now - timespan) / 1000) + "秒前";
  }
  else if ((now - timespan) < 1 * 60 * 60 * 1000) {
    //如果小于1小时,则显示多少分钟
    return Math.floor((now - timespan) / (1000 * 60)) + "分钟前";
  }
  else if (now - timespan < 12 * 60 * 60 * 1000) {
    //如果小于12小时,显示 多少小时前
    return Math.floor((now - timespan) / (1000 * 60 * 60)) + "小时前";
  } else {
    //显示日期
    let newDate = new Date(timespan);
    return `${(newDate.getMonth() + 1)}月 ${newDate.getDate()}日 ${newDate.getHours()}-${newDate.getMinutes()}`
  }
}

var CreateWebSocket = (function () {
  return function (urlValue) {
    if (window.WebSocket) return new WebSocket(urlValue);
    if (window.MozWebSocket) return new MozWebSocket(urlValue);
    return false;
  }
})()

create_web_sockect = () => {
  let socket = io();
  socket.emit('ws_request', JSON.stringify({
    'type': 'new_user_online'
  }));
  socket.on('notice', function (msg) {
    if (msg) {
      msg = JSON.parse(msg);
      if (msg.type=='new_news') {
        //有新的文章发布
        alert('有新文章发布了!!');
      }
    }
    console.log("chat message info===>", msg);
    ;
  });
}