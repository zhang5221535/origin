let falls = (function () {
    let columns = Array.from(document.querySelectorAll('.column')),
        data = [];
    //从服务器拿数据
    let queryData = function () {
        let xhr = new XMLHttpRequest;
        xhr.open('get', 'json/data.json', false);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText)
            }
        }
        xhr.send(null)
    };

    //绑定数据
    let bindHTML = function () {
        //同比例缩放
        data = data.map(item => {

            let w = item.width,
                h = item.height;
            // 真实渲染的高度
            h = h / (w / 285);
            item.width = 285;
            item.height = h;

            return item;;
        })
        for (let i = 0; i < data.length; i += 3) {
            let group = data.slice(i, i + 3);
            group.sort((a, b) => {
                return a.height - b.height;
            });
            columns.sort((a, b) => {
                return b.offsetHeight - a.offsetHeight;
            });
            group.forEach((item, index) => {
                let { pic,
                    height,
                    title,
                    link
                } = item;
                let card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<a href="${link}">
                <div class="delayBox" style="height:${height}px">
                    <img src="" alt="" data-image="${pic}">
                </div>
                <p>${title}</p>
            </a>`;
                columns[index].appendChild(card);
            })
        }

    };

    //延迟加载
    let delayFunc = function () {
        let delayBox = document.querySelectorAll('.delayBox');
        [].forEach.call(delayBox, item => {
            let isLoad = item.getAttribute('isLoad');
            if (isLoad === 'true') return;




            let b = utils.offset(item).top + item.offsetHeight / 2,
                a = document.documentElement.clientHeight + document.documentElement.scrollTop;
            if (b <= a) {
                lazyImg(item);
            }
        })
    };
    let lazyImg = function lazyImg(delayBox) {
        let img = delayBox.querySelector('img'),
            dataImage = img.getAttribute('data-image'),
            tempImage = new Image;
        tempImage.src = dataImage;
        tempImage.onload = () => {
            img.src = dataImage;
            utils.css(img, 'opacity', 1);

        }
        img.removeAttribute('data-image');
        tempImage = null;
        delayBox.setAttribute('isLoad', 'true');

    };
    //再拿数据
    let isRender;
    let loadMoreData = function loadMoreData() {
        let HTML = document.documentElement;
        if (HTML.clientHeight + HTML.clientHeight / 2 + HTML.scrollTop >= HTML.scrollHeight) {
            if (isRender) return;
            isRender = true;
            queryData();
            bindHTML();
            delayFunc();
            isRender = false;
        }
    };

    return {
        init() {
            queryData(),
                bindHTML(),
                delayFunc(),
                window.onscroll = function () {
                    delayFunc();
                    loadMoreData();

                }


        }
    }
})();
falls.init()