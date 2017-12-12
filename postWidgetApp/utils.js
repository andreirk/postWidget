
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
    }
})();


