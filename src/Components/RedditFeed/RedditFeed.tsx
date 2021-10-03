import React, { useEffect, useState, useCallback } from "react"
import {getRedditPosts} from './RedditFeed.service'
import debounce from 'lodash.debounce'
import Modal from 'react-modal'

Modal.setAppElement('#root');


const RedditFeed = () => {

    //interface for post modal object typing
    interface PostModalObj {
        author? : string,
        authorLink? : string,
        title? : string,
        postImageUrl? : string
        postLink? : string,
        id? : string
    }

    //styling to center modal
    const customModalStyles = {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      };

      

    //states for our componnet
    const [posts, setPosts] = useState<PostModalObj[]>([{}]);
    const [nonFilteredPosts, setNonFilteredPosts] = useState<PostModalObj[]>([{}]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState<PostModalObj>({});
    const [filterTerm, setFilterTerm] = useState("");

    //immediately call data function when app is rendered
    useEffect(() => {
        getData(); 
    }, []);

    //async function, calls service to get reddit posts
    async function getData(){
        const data = await getRedditPosts();


        //critical - no data
        if(!data || data.length === 0){
            alert("no data, please contact customer support and inform them of this issue");
        }
        //otherwise, we have data, and we filter to get rid of all posts without an image
        else{
            const dataWithNoNullImages = data.filter((post) => post.postImageUrl.includes('.png') || post.postImageUrl.includes('.jpg'));
            setPosts(dataWithNoNullImages);
            setNonFilteredPosts(dataWithNoNullImages);
        }
        
    }

    //open modal, passes in data
    const openModal = (post : PostModalObj) => {
        setModalIsOpen(true);
        setSelectedPost(post)
    }

    //close modal
    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedPost({});
    }

   const filterPosts = (event:any) => {
        const termToFilterOn : string = event;
        setFilterTerm(termToFilterOn);
        if(!termToFilterOn || termToFilterOn === ""){
            setPosts(nonFilteredPosts);
        }
        else{
            const filteredTerm : string = termToFilterOn.toLowerCase();
            const filteredPosts = nonFilteredPosts.filter((post : any) => post.title.toLowerCase().includes(filteredTerm));
            setPosts(filteredPosts);
        }
    }

    //debounce function
    /*
    const filterPostsDebounceVersion = useCallback(
        debounce(filterTerm => {
            if(!filterTerm || filterTerm === ""){
                //reset
                setPosts(nonFilteredPosts);
            }
            else{
                //filter for search term
                const filteredTerm : string = filterTerm.toLowerCase();
                const filteredPosts = nonFilteredPosts.filter((post : any) => post.title.toLowerCase().includes(filteredTerm));
                setPosts(filteredPosts);
            }
        }, 1000)
    ,[]);
    

    const debouncedChangeHandler = (event : any) => {
        setFilterTerm(event.target.value);
        filterPostsDebounceVersion(event.target.value)
    }
    */

    //render object
    return (
        <div>
            <div className="bg-gray-50">
                 {/* filter posts by keyword */}
                 <div className="flex flex-col w-full justify-center items-center mb-4 pt-2">
                    <input 
                        className="border border-black rounded w-10/12 md:w-6/12 p-2 bg-white"
                        type="text"
                        value={filterTerm}
                        //onChange={debouncedChangeHandler}
                        onChange={(e) => filterPosts(e.target.value)}
                        placeholder="Filter by title"
                    ></input>
                 </div>
                {
                <div>
                    {/* create view for reddit posts */}
                    {posts.length ? posts.map((post : any) => {
                        return (<div key={post.id} className="flex flex-col w-full justify-center items-center mb-4">
                            <div onClick={() => openModal(post)} className="border border-black rounded w-10/12 md:w-6/12 p-2 bg-white text-center">
                                <p className="text-l md:text-xl font-semibold pb-2">{post.title}</p>
                                <img className="w-4/12 m-auto rounded" src={post.postImageUrl}></img>
                            </div>
                            {/* modal opens via click on above div */}
                            <Modal  className="max-w-9/10 max-h-9/10 fixed overflow-auto border border-black rounded"
                                    isOpen={modalIsOpen} 
                                    onRequestClose={closeModal}
                                    shouldCloseOnOverlayClick={true}
                                    style={customModalStyles}>

                                <div className="m-4">
                                    <p>Posted by <a href={selectedPost.authorLink} target="_blank">/u/{selectedPost.author}</a></p>
                                    <a className="text-xl font-semibold py-2" 
                                       href={selectedPost.postLink}
                                       target="_blank">
                                           {selectedPost.title}
                                    </a>
                                    <img className="max-w-3xl max-h-96 rounded" src={selectedPost.postImageUrl}></img>
                                </div>

                            </Modal>
                        </div>)
                    })
                    :
                    // if no posts contain search query, show default message
                    <div className="flex flex-col w-full justify-center items-center text-center">
                        <p className="w-10/12 md:w-6/12 p-2">No results! Please try another term to filter by.</p>
                    </div>
                    }
                </div>
                }
            </div>
        </div>
    )
}

export default RedditFeed;
