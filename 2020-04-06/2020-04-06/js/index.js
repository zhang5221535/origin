
let shopModule = (function () {

    let navList = document.querySelectorAll('.main li'),
        productBox = document.querySelector('.picture'),
        data = null;
    let queryData = function queryData() {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', './json/product.json', false);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
    };
    let render = function render() {
        let str = ``;
        data.forEach(item => {
            let {
                title,
                price,
                time,
                hot,
                img
            } = item;

            str += `<div class="icon">
                <img src="${img}" alt="">
                <p>${title}</p>
                <ul>
                    <li>价格：￥${price.toFixed(2)}</li>
                    <li>销量：${hot}</li>
                    <li>时间：${time.replace(/-/g, '/')}</li>
                </ul>
            </div>`;
        });
        productBox.innerHTML = str;
    };
    let clear = function clear() {
        Array.from(navList).forEach(item => {
            if (item !== this) {
                item.flag = -1;
            }
        });
    };
    let handle = function handle() {
        Array.from(navList).forEach(item => {
            item.flag = -1;
            item.onclick = function () {
                clear.call(this);
                this.flag *= -1;
                let pai = this.getAttribute('data-pai');
                data.sort((a, b) => {
                    a = String(a[pai]).replace(/-/g, '');
                    b = String(b[pai]).replace(/-/g, '');
                    return (a - b) * this.flag;
                });
                render();
            };
        });
    };
    return {
        init() {
            queryData();
            render();
            handle();
        }
    };
})();
shopModule.init();