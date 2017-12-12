
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
                    this.posts = _posts;
                    this.notify(this)
                })
        }

        update (numOfPosts) {
            this.loadData(null, numOfPosts)
        }
    }

    return ObservablePostListModel
})()

