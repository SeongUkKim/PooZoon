// var regionName;
var page_reload = 0;
var HOME_PATH = window.HOME_PATH || '.',
// urlPrefix = 'HOME_PATH' +'/data/region',
urlPrefix = 'https://navermaps.github.io/maps.js.ncp/docs/' +'/data/region',
urlSuffix = '.json',
regionGeoJson = [],
loadCount = 0;

for (var i = 1; i < 18; i++) {
var keyword = i +'';

if (keyword.length === 1) { 
    keyword = '0'+ keyword;
}
$.ajax({
    url: urlPrefix + keyword + urlSuffix,
    success: function(idx) {
        return function(geojson) {
            regionGeoJson[idx] = geojson;
            loadCount++;
            if (loadCount === 17) { 
                startDataLayer();
            }
        }
    }(i - 1)
});
}

// 맵을 정의한다.
var map = new naver.maps.Map(document.getElementById('map'), { // 기본 맵생성과, 시작줌 위치 지정
zoom:3,
mapTypeId: 'normal',
minZoom: 3,
center: new naver.maps.LatLng(36.4203004, 128.317960) // 기본 멥 시작 위치
});

var tooltip = $('<div id="#main_map" style="position:absolute;z-index:1000;padding:5px 10px;background-color:#fff;border:solid 2px #000;font-size:14px;pointer-events:none;display:none;"></div>');
tooltip.appendTo(map.getPanes().floatPane);

function startDataLayer() {
map.data.setStyle(function(feature) {
    var styleOptions = {
        fillColor: '#D2FFD2',
        fillOpacity: 0.0001,
        strokeColor: '#D2FFD2',
        strokeWeight: 2,
        strokeOpacity: 0.4
    };

    if (feature.getProperty('focus')) {
        styleOptions.fillOpacity = 0.6;
        styleOptions.fillColor = '#FFB4B4';
        styleOptions.strokeColor = '#FFB4B4';
        styleOptions.strokeWeight = 4;
        styleOptions.strokeOpacity = 1;
    }
    return styleOptions;
});

regionGeoJson.forEach(function(geojson) { map.data.addGeoJson(geojson);});

map.data.addListener('click', function(e) {

    page_reload+=1;

    // var tossregion; // 지역정보를 넘겨 지역 마크만 찍기위해 필요한변수

    var feature = e.feature;
    regionName = feature.getProperty('area1'); // 지역지정
    if(regionName=="울산광역시" ||regionName=="세종특별자치시"){
        alert("Data 없음.");
        location.reload();
    }
    if (feature.getProperty('focus') !== true) {
        
        feature.setProperty('focus', true);
        $.ajax({
            url: '/regiondata',
            dataType: 'text',
            type: 'GET',
            data: {
                datax:e.offset.x,
                datay:e.offset.y,
                region : regionName
            },
            success: function (result) {
                if (result) {
                    click_map(result);   // tossregion = result;
                }
            }
        });
    } 
    else {
        feature.setProperty('focus', false);
        if(page_reload%2==0){ location.reload();}
    }
});
map.data.addListener('mouseover', function(e) {
    var feature = e.feature;
    var regionName = feature.getProperty('area1');

    tooltip.css({
        display: '', // 마우스위치에 따라 지역위치를 표현해주는 박스
        left: e.offset.x,
        top: e.offset.y
    }).text(regionName);// 지역위치를 쓴다.
    map.data.overrideStyle(feature, {
        fillOpacity: 0.6,
        strokeWeight: 4,
        strokeOpacity: 1
    });
});

map.data.addListener('mouseout', function(e) {
    tooltip.hide().empty();
    map.data.revertStyle();
});
}