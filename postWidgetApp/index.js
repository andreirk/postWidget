
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

