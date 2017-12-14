
const utils = (function () {
    function formatedStr2Date (str){
        const postDate = new Date(str);
        // DD/MM/YYYY HH:MM
        const day = postDate.getDate()
        const month = postDate.getMonth() + 1
        const year = postDate.getFullYear()
        const hours = postDate.getHours()
        let minutes = postDate.getMinutes()
        if(minutes.toString().length < 2 ){
            minutes = `0${minutes}`
        }

        const formatedDate = `${day}/${month}/${year} ${hours}:${minutes}`

        return formatedDate
    }

      function areArrsEqual(value, other) {

        const type = Object.prototype.toString.call(value);

        if (type !== Object.prototype.toString.call(other)) return false;

        if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

        const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
        const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
        if (valueLen !== otherLen) return false;

        const compare = function (item1, item2) {

            const itemType = Object.prototype.toString.call(item1);

            if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
                if (!areArrsEqual(item1, item2)) return false;
            }

            else {
                if (itemType !== Object.prototype.toString.call(item2)) return false;
                if (itemType === '[object Function]') {
                    if (item1.toString() !== item2.toString()) return false;
                } else {
                    if (item1 !== item2) return false;
                }

            }
        };


        if (type === '[object Array]') {
            for (let i = 0; i < valueLen; i++) {
                if (compare(value[i], other[i]) === false) return false;
            }
        } else {
            for (let key in value) {
                if (value.hasOwnProperty(key)) {
                    if (compare(value[key], other[key]) === false) return false;
                }
            }
        }
        return true;

    }

    function fetchPostsService(url, num) {
        return fetch(url)
            .then(function(response) {
                return response.json();
            }).then(function(data) {
                const cut_data = data.slice(1).slice(-num)
                return cut_data

            }).catch(err => console.error('error in fetch', err));
    }

    return  {
        fetchPostsService,
        formatedStr2Date,
        areArrsEqual
    }
})();


