import axios from "axios";

async function getRedditPosts(){
    const url : string = `https://www.reddit.com/r/pics/.json?jsonp=`;
    const REDDIT_BASE_URL = 'https://www.reddit.com'

    //our return object
    let redditPicsObj : Array<any> = [{}];

    try{
        const response = await axios.get<any>(url);

        //build return object
        redditPicsObj = response.data.data.children.map((post : any) => ({
                author: post.data.author,
                authorLink: REDDIT_BASE_URL + '/u/' + post.data.author,
                id: post.data.id,
                postImageUrl: post.data.url,
                postLink: REDDIT_BASE_URL + post.data.permalink,
                title: post.data.title
            })
        );
        
        /*redditPicsObj = response.data.data.children.map((post)=> ({
            pictureUrl: post.data.url
        }));*/
    }
    catch(error){
        console.log(error);
    }

    return redditPicsObj;
}

export {getRedditPosts};