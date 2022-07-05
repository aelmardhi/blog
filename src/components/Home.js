import { useEffect, useState } from 'react';
import './Home.css'
import PostHeader from './PostHeader';
import Loader from './Loader';

const LOADING_STATE = {loading:0, success:1, error:2, redirect:3}

function Home(){
    const user = JSON.parse(localStorage.getItem('user'))
    const [loadingState, setLoadingState] = useState(LOADING_STATE.loading)
    const [data, setData] = useState([{
        "author":{
            "name":"aelmardhi",
            "profileImage":""
        },
        "project":"none",
        "time": 1656226644214,
        "blocks": [
            {
                "id": "eeZqy4ThST",
                "type": "paragraph",
                "data": {
                    "text": "some times i try to evaluate all the code written in this repository"
                }
            }
        ],
        "version": "2.25.0",
        "title": "amazing work has been done at kdsj"
    },
    {
        "author":{
            "name":"aelmardhi",
            "profileImage":"https://res.cloudinary.com/dzrwq9pyu/image/upload/v1589248125/profile_images/5eb58733e838f7001761adfb.jpg"
        },
        "project":"none",
        "time": 1656228357017,
        "blocks": [
            {
                "id": "UG4z_fkBvm",
                "type": "paragraph",
                "data": {
                    "text": "I'm exited to announce that I'm working on a new <b>Blog</b>&nbsp;to talk about my projects and technical reviews . I am very passionate about web technologies specially the mern stack wich I'm using to build this blog"
                }
            },
            {
                "id": "TvKk4mepcH",
                "type": "header",
                "data": {
                    "text": "MERN Stack Components",
                    "level": 2
                }
            },
            {
                "id": "iN1_6gZ3-Y",
                "type": "list",
                "data": {
                    "style": "ordered",
                    "items": [
                        "NodeJs",
                        "ExpressJs",
                        "ReactJs",
                        "MongoDb"
                    ]
                }
            }
        ],
        "version": "2.25.0",
        "title": "new Blog"
    },
    {
        "author": {
            "name": "عبدالله المرضي",
            "_id": "5eb58733e838f7001761adfb",
            "profileImage": "https://res.cloudinary.com/dzrwq9pyu/image/upload/v1589248125/profile_images/5eb58733e838f7001761adfb.jpg"
        },
        "title": "trying to save online",
        "time": "2022-07-03T14:26:31.269Z",
        "public": false,
        "id": "62c1a7170c2f144faac2f1c7",
        "project": "none",
        "blocks": [
            {
                "id": "zca3kxUPjy",
                "type": "paragraph",
                "data": {
                    "text": "this is the first image to be saved at the&nbsp;<b>cloudinary</b>"
                }
            },
            {
                "id": "b3cpHhYyq9",
                "type": "image",
                "data": {
                    "file": {
                        "url": "https://res.cloudinary.com/dzrwq9pyu/image/upload/v1656858367/profile_images/blogImage-2022-07-03T14:26:05.049Z.jpg.jpg"
                    },
                    "caption": "jst an imge found on my mp3s",
                    "withBorder": false,
                    "stretched": false,
                    "withBackground": false
                }
            }
        ]
    }])
    useEffect(()=>{
        fetch('/api/blog/',{
                method: 'GET',
                headers: {
                  'auth-token': user?.['auth-token'],
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
        }).then(r=>r.json().then(d=>{
            setLoadingState(LOADING_STATE.success)
            console.log(d)
             setData(d)
        })).catch(e=>{
            console.log(e)
            setLoadingState(LOADING_STATE.error)
        })
    },[])

    switch(loadingState){
        case LOADING_STATE.loading:
            return( <Loader></Loader>)
        case LOADING_STATE.error:
            return(<div className='error'>
                <h3>Erorr: could not load</h3>
            </div>)
        case LOADING_STATE.success:
        default:
            return (
                <div className='column home'>
                {
                    data.map((item ,key)=>{
                        let set={img:false,p:false}
                        return (<div className={'postHome'+(item.public?'':' private')} key={key}>
                            <a href={'/blog/post/'+item.id}>
                            <PostHeader post={item}></PostHeader>
                            
                            {item.blocks.slice(0,2).map((b,key)=>{
                                switch(b.type){
                                    case 'paragraph': 
                                        return((!set.p)&&<p key={key} dangerouslySetInnerHTML={{__html:b.data.text.length > 200 ?
                                            b.data.text.substring(0,200).substring(0,b.data.text.substring(0,200).lastIndexOf(' ')):
                                            b.data.text}}></p>)
                                    case 'image':
                                        return((!set.img)&&<div key={key} id={b.id} className={'img'+(b.data.withBorder?' withBorder':'')+(b.data.withBackground?' withBackground':'')+(b.data.stretched?' stretched':'')}>
                                                    <img src={b.data.file.url} alt={b.data.caption}></img>
                                                </div> )
                                    default:
                                        return(<br key={key}></br>)
                                }
                            })}
                            
                        </a>
                        </div>)
                    })
                }
                </div>
            )
    }
}
export default Home;