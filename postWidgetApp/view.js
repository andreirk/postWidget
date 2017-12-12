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

        postList.posts.forEach(el => {
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