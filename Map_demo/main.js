const express = require('express');
const fs = require('fs');
const request = require("request");
const mysql = require('mysql');

const app = express();
app.use(express.static('public'));

var connection = mysql.createConnection({
    host: '210.89.190.246',
    post: 3306,
    user: 'root',
    password: 'Emote164@',
    database: 'test'
});
connection.connect();

app.get('/', (req, res) => {
  
    fs.readFile('Map.html', 'utf8', (err, data) => {
        try {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        } catch (error) {
            console.log(error);
            res.end("this is error page");
        }
    });
});

app.get('/regiondata', (req, res) => {
    var where = req.query.region;
    var result;
    if (where == "서울특별시") {
        console.log("서울특별시 data 호출");
        result = "01";
    }
    else if (where == "경기도") {
        console.log("경기도 data 호출");
        result = "09";
    }
    else if (where == "인천광역시") {
        console.log("인천광역시 data 호출");
        result = "04";
    }
    else if (where == "강원도") { 
        console.log("강원도 data 호출"); 
        result = "10";
    }
    else if (where == "충청남도") { 
        console.log("충청남도 data 호출"); 
        result = "12";
    }
    else if (where == "세종특별자치시") { 
        console.log("세종특별자치시 data 호출"); 
        result = "07"; //
    }
    else if (where == "대전광역시") { 
        console.log("대전광역시 data 호출"); 
        result = "06";
    }
    else if (where == "충청북도") { 
        console.log("충청북도 data 호출"); 
        result = "11";
    }
    else if (where == "경상북도") { 
        console.log("경상북도 data 호출"); 
        result = "15";
    }
    else if (where == "경상남도") { 
        console.log("경상남도 data 호출"); 
        result = "16";
    }
    else if (where == "대구광역시") { 
        console.log("대구광역시 data 호출"); 
        result = "03";
    }
    else if (where == "울산광역시") { 
        console.log("울산광역시 data 호출"); 
        result = "08"; //
    }
    else if (where == "부산광역시") { 
        console.log("부산광역시 data 호출"); 
        result = "02";
    }
    else if (where == "전라북도") { 
        console.log("전라북도 data 호출"); 
        result = "13";
    }
    else if (where == "전라남도") { 
        console.log("전라남도 data 호출"); 
        result = "14";
    }
    else if (where == "광주광역시") { 
        console.log("광주광역시 data 호출"); 
        result = "05";
    }
    else if(where == "제주특별자치도"){
        console.log("광주광역시 data 호출"); 
        result = "17";
    }
    res.send({ result: result });
});


// DB에서 경로를 가져오는 코드
app.get('/markup',(req,res)=>{

    
    var where = JSON.parse(req.query.tossregion);
    where = JSON.stringify(where.result);
    console.log("/markup >> "+where);
    connection.query('select Road_Name from Food_Truck where City_Code='+where, function (err, rows, fields) {
        if (!err) {
            var Road = JSON.stringify(rows);
            res.send(Road);
        } else {
            console.log('query error : ' + err);
            res.send(err);
        }
    });
});
app.listen(9090, () => {console.log("server open 9090");});


//************************************ */
//  https://www.google.com/search?ei=2nvtXOKhOJupoAS005yACw&q=ajax+pending&oq=ajax+pending&gs_l=psy-ab.3..0l2j0i7i30l2j0j0i7i30l5.3966.6196..6393...1.0..0.159.835.6j2......0....1..gws-wiz.......0i71j0i13j0i10i30j0i5i30j0i7i5i30j0i8i30j0i67j0i7i10i30j0i10.FhLF3Ymu5HE
// pending 오류가 발생 할 수 있다.
///////////////////////////////////////////
// https://expressjs.com/ko/starter/static-files.html
// 그러나 express.static 함수에 제공되는 경로는 node 프로세스가 실행되는 디렉토리에 대해 상대적입니다. 
// Express 앱을 다른 디렉토리에서 실행하는 경우에는 다음과 같이 제공하기 원하는 디렉토리의 절대 경로를 사용하는 것이 더 안전합니다.
// request("https://navermaps.github.io/maps.js.ncp/docs/data.json", function(err, res, body) { console.log(body); });
//************************************ */