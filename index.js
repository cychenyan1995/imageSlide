// 翻转的方法
turn = (ele) => {
    let cls = ele.className;
    // 导航的class也有修改
    let n = ele.id.split('-')[1];
    let currNav = document.getElementById('nav-' + n);
    if (!/photo-center/.test(cls)) {
        sortCenter(n);
        return;
    }
    // 正则匹配
    if (/photo-front/.test(cls)) {
        // 正则替换
        cls = cls.replace(/photo-front/, 'photo-back');
        currNav.className += ' i-back ';

    } else {
        cls = cls.replace(/photo-back/, 'photo-front');
        currNav.className = currNav.className.replace(/\s*i-back\s*/, ' ');
    }
    return ele.className = cls;
}

// 3.
// 3.1 id class选择器公用方法
function g(selector) {
    let method = selector.substr(0, 1) !== '.' ? 'getElementById' : 'getElementsByClassName';
    return document[method](selector.substr(1));
}
// 3.2读取data.js中的数据
var data = data;

function readData() {
    // let data = data;
    let html = [];
    // 导航
    let nav = [];
    // s 下标
    for (s in data) {
        let currHtml = g('#wrap').innerHTML;
        // 替换模板数据
        currHtml = currHtml.replace("{{index}}", s)
            .replace("{{img}}", data[s].img)
            .replace("{{caption}}", data[s].caption)
            .replace("{{desc}}", data[s].desc);
        html.push(currHtml);
        nav.push(`<span class="i" id="nav-${s}" onclick="turn(g('#image-${s}'))"></span>`)
    }
    html.push('<div class="nav">' + nav.join('') + '</div>')
    g('#wrap').innerHTML = html.join('');
    // 随机选取图片
    sortCenter(random([0, data.length]));
}
window.onload = function() {
    readData();
    //console.log(document.getElementById('wrap'));
}

// 4.随机生成中间的图片
// 5.排序海报
function sortCenter(n) {
    // 得到所有图片  伪数组  一般的数组方法都可以使用
    let _photo = g('.photo');
    // 转化为真正的数组
    let photos = [];
    //导肮的当前选中项
    let nav = g('.i');
    for (var s = 0; s < _photo.length; s++) {
        // 初始化当前点击图片的位置
        _photo[s].className = _photo[s].className.replace(/\s*photo-center\s*/, " ")
            .replace(/\s*photo-front\s*/, " ")
            .replace(/\s*photo-back\s*/, " ");


        _photo[s].className += " photo-front ";

        _photo[s].style.left = '';
        _photo[s].style.top = '';
        _photo[s].style["transform"] = _photo[s].style["-webkit-transform"] = "rotate(0deg) scale(1)";

        // 还原被选中的导航的样式
        nav[s].className = nav[s].className.replace(/\s*i-back\s*/, " ");
        nav[s].className = nav[s].className.replace(/\s*i-curr\s*/, " ");
        photos.push(_photo[s]);
    }
    let photo_center = g(`#image-${n}`);
    //给图片加上居中的class
    photo_center.className += ' photo-center ';
    // 将居中的图片从数组中移除
    photos.splice(n, 1);
    // 将剩下的图片分为左右2部分
    let photo_left = photos.splice(0, Math.ceil(photos.length / 2)); // 取整
    let photo_right = photos;
    // 取值范围
    let ranges = range();
    for (s in photo_left) {
        let photo = photo_left[s];
        photo.style.left = random(ranges.left.x) + 'px';
        photo.style.top = random(ranges.left.y) + 'px';
        photo.style["transform"] = photo.style["-webkit-transform"] = "rotate(" + random([-150, 150]) + "deg) scale(1)";
    }
    for (s in photo_right) {
        let photo = photo_right[s];
        photo.style.left = random(ranges.right.x) + 'px';
        photo.style.top = random(ranges.right.y) + 'px';
        photo.style["transform"] = photo.style["-webkit-transform"] = "rotate(" + random([-150, 150]) + "deg) scale(1)";
    }

    // 修改当前样式
    g(`#nav-${n}`).className += ' i-curr ';
}
// 随机生成1-20之间的数
function random(range) {
    let max = Math.max(range[0], range[1]);
    let min = Math.min(range[0], range[1]);
    let diff = max - min;
    let num = Math.ceil(Math.random() * diff + min);
    return num;
}
// 6.左右分区的随机位置
function range() {
    let ran = { left: { x: [], y: [] }, right: { x: [], y: [] } };
    let wrap = {
        w: g('#wrap').clientWidth,
        h: g('#wrap').clientHeight
    };
    let photo = {
        w: g('.photo')[0].clientWidth,
        h: g('.photo')[0].clientHeight
    };
    ran.wrap = wrap;
    ran.photo = photo;
    ran.left.x = [0 - photo.w, wrap.w / 2 - photo.w / 2];
    ran.left.y = [0 - photo.h, wrap.h];
    ran.right.x = [wrap.w / 2 + photo.w / 2, wrap.w + photo.w];
    ran.right.y = ran.left.y;
    return ran;
}


// 注意点
// 1.VCD分解
// 2.css @
// 3.伪类