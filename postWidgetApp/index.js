
/**
 *  ======== Controller =========
 */

function PostWidget({destElem, feedUrl, numOfPosts, updateInterval}) {
    _this = this;

    this.view = new View(destElem);

    this.model = new PostListModel(feedUrl, numOfPosts)

    this.init = function( ){
        this.model.addObserver(this.view.render)
        this.model.loadData()
    }

    this.run = function (rendomNumOfPosts) {
        if(rendomNumOfPosts){
            setInterval(() => {
                numOfPosts = Math.floor(Math.random() * 10);
            }, 1000)
        }
        var timerId = setTimeout(function tick() {
            _this.model.update.call(_this.model, numOfPosts);
            timerId = setTimeout(tick, updateInterval);
        }, updateInterval);
    }

}


/**
 * // ========= MODEL ===========
 */

// export main app Model
const PostListModel = (function () {
    class PostModel{
        constructor(data){
            this.createdAt = utils.formatedStr2Date(data.created_at);;
            this.text = data.text;
            this.authorName = data.user.name;
        }
    }

    class ObserverList {
        constructor(){
            this.observerList = [];
        }
        add(obj) {
            return this.observerList.push(obj)
        }
        get(index) {
            if(index > -1 && index < this.observerList.length){
                return this.observerList[ index ]
            }
        }
        count() {
            return this.observerList.length;
        }
    }


    class ObservableModel {
        constructor(){
            this.observers = new ObserverList();
        }

        notify (context) {
            const observerCount = this.observers.count();
            for(let i = 0; i < observerCount; i++){
                if( typeof this.observers.get(i) === 'function') this.observers.get(i)(context);
            }
        }

        addObserver (observer) {
            this.observers.add( observer )
        }

    }

    class ObservablePostListModel extends ObservableModel {
        constructor(feedUrl, numOfPosts){
            super();
            this.posts = [];
            this.resourceUrl = feedUrl;
            this.numOfPosts = numOfPosts;
            this.observers = new ObserverList();
        }


        loadData(){
            const url = arguments[0] || this.resourceUrl;
            const numOfPosts = arguments[1] || this.numOfPosts;
            utils.fetchPostsService(url, numOfPosts )
                .then(data => {
                    const _posts = []
                    data.forEach(el => {
                        _posts.push(new PostModel(el))
                    })
                    const equal = utils.areArrsEqual(this.posts, _posts)
                    if(!equal){
                        this.posts = _posts;
                        this.notify(this.posts)
                    }

                })
        }

        update (numOfPosts) {
            this.loadData(null, numOfPosts)
        }
    }

    return ObservablePostListModel
})()


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


/**
 * ======== View module =========
 */

const View = function (destElem) {
    const postListElem = $(`<div id="postListElem" class="card w-25 p-1 m-1" ></div>`)
    const innerDiv = $('<div class="inner"></div>')

    $( destElem ).append( postListElem );

    this.render = function (postList) {
        postListElem.empty()
        postListElem.append(innerDiv)

        const arrOfElements = []

        postList.forEach(el => {
            const createdAtEl = $("<div class='postDate card-header'></div>").text(el.createdAt)
            const bodyEl = $("<div class='postText card-body'></div>").text( el.text )
            const authorNameEl = $("<div class='authorName'></div>").text(el.authorName)
            const postEl = $('<div class="postContent card-footer"></div>');
            postEl.append(createdAtEl, bodyEl, authorNameEl)
            arrOfElements.push(postEl)
        })
        innerDiv.replaceWith(arrOfElements)
    }
}