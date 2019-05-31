function click_map(tossregion) {
    var array = new Array(); // db에서 가져온 Road_Name 데이터
    var array_mark = new Array(); // 마크를 담는 배열
    // let array_kyung = new Array();
    // let array_yido = new Array();
    let array_kyung;
    let array_yido;
    var result;

    $.ajax({
        url: '/markup',
        dataType: 'text',
        type: 'GET',
        data: {
            tossregion: tossregion
        }, // 여기다가 tossregion 전달하면 가능 할 듯
        success: function (result) {
            if (result) {


                var pars = JSON.parse(result);
                var array = new Array();
                for (var i = 0; i < pars.length; i++) {
                    array[i] = JSON.stringify(pars[i].Road_Name).replace('"', '').replace('"', '');
                }

                for (var x = 0; x < array.length; x++) {
                    // 주소가 있는지 체크
                    var $address = array[x];


                    naver.maps.Service.geocode({ address: $address }, function (status, response) {

                        if (status !== naver.maps.Service.Status.OK) {
                            return alert(myaddress + '의 검색 결과가 없거나 기타 네트워크 에러');
                        }
                        var result = response.result;
                        // 검색 결과 갯수: result.total 
                        // 첫번째 결과 결과 주소: result.items[0].address 
                        // 첫번째 검색 결과 좌표: result.items[0].point.y, result.items[0].point.x 
                        var myaddr = new naver.maps.Point(result.items[0].point.x, result.items[0].point.y);
                        map.setCenter(myaddr); // 검색된 좌표로 지도 이동 
                        // 마커 표시 ( 검색한 주소에 마커를 찍어둠 )
                        var marker = new naver.maps.Marker({
                            position: myaddr,
                            map: map
                        });
                        // 마커 클릭 이벤트 처리 ( 클릭할 경우 infowindow에 등록된 이미지와 이름이 뜸 )
                        naver.maps.Event.addListener(marker, "click", function (e) {
                            if (infowindow.getMap()) {
                                infowindow.close();
                            } else {
                                infowindow.open(map, marker);
                            }
                        });
                        // 마크 클릭시 인포윈도우 오픈 
                        var infowindow = new naver.maps.InfoWindow({
                            //띄워줄 이름과 사이트 이미지, 클릭했을경우 이동할 url 주소를 입력해주면 된다.
                            content: '<h4>' + result.items[0].address + '</h4><a href="#" target="_blank"></a>'
                        });
                    });
                }
            }
        }
    });
}