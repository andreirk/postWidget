
const config = {
    destElem : "#app",
    feedUrl : 'https://api.massrelevance.com/MassRelDemo/kindle.json',
    numOfPosts : 5,
    updateInterval : 2000
}

const postWidget = new PostWidget(config);

postWidget.init();

// set to true to display different num of Posts every second (for demo purpose )
const rendomNumOfPosts = true;

postWidget.run(rendomNumOfPosts);









