import { useEffect, useState } from 'react';
import {Link, useParams}  from "react-router-dom"
import hljs from 'highlight.js/lib/common';
import PostHeader from './PostHeader';
import Loader from './Loader';

import './Post.css'
const LOADING_STATE = {loading:0, success:1, error:2, redirect:3}


    
    function Post(props){
        const user = JSON.parse(localStorage.getItem('user'))
        const id = useParams().id 
        const [loadingState,setLoadingState] = useState(LOADING_STATE.loading)
        const [data, setData] = useState({
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
                },
                {
                    "type" : "code",
                    "data" : {
                        "code": "```html```\n<button>call</button>",
                    }
                },
                {
                    "type" : "raw",
                    "data" : {
                        "html": "<div style=\"background: #000; color: #fff; font-size: 30px; padding: 50px;\">Any HTML code</div>",
                    }
                }
            ],
            "version": "2.25.0",
            "title": "new Blog"
        })

        useEffect(()=>{

            fetch('/api/blog/post/'+id,{
                method: 'GET',
                headers: {
                  'auth-token': user?.['auth-token'],
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
        }).then(r=>r.json().then(d=>{
            console.log(d)
             setData(d)
             setLoadingState(LOADING_STATE.success)
        })).catch(e=>{
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
                    <article className='post'>
                        <div className='row spaceBetween alignCenter'>
                        <PostHeader post={data}></PostHeader>
                        { (data.author._id === user?._id ) &&<Link className='actionBtn ' to={'/post/'+id+'/edit'}>Edit</Link>}
                        </div>
                        <div className='postContent'>
                            {data.blocks.map((b,key)=>{
                                switch(b.type){
                                    case 'paragraph':
                                    return (<p key={key} id={b.id} dangerouslySetInnerHTML={{__html:b.data.text}}></p>)
                                    
                                    case 'list':
                                        if(b.data.style === 'ordered'){
                                            return(<ol key={key} id={b.id} >{b.data.items.map((i,key)=>{
                                                return(<li key={key}>{i}</li>)
                                            })}</ol>)
                                        }
                                        return(<ul key={key} id={b.id} >{b.data.items.map((i,key)=>{
                                                return(<li key={key}>{i}</li>)
                                            })}</ul>)
                                        
                                        case 'header':
                                            switch(b.data.level){
                                                case 1:
                                                    return(<h1 key={key} id={b.id} >{b.data.text}</h1>)
                                                    
                                                case 2:
                                                    return(<h2 key={key} id={b.id} >{b.data.text}</h2>)
                                                    
                                                case 3:
                                                    return(<h3 key={key} id={b.id} >{b.data.text}</h3>)
                                                    
                                                case 4:
                                                    return(<h4 key={key} id={b.id} >{b.data.text}</h4>)
                                                    
                                                case 5:
                                                    return(<h5 key={key} id={b.id} >{b.data.text}</h5>)
                                                    
                                                case 6:
                                                    return(<h6 key={key} id={b.id} >{b.data.text}</h6>)
                                                    
                                                default:
                                                    return(<h3 key={key} id={b.id} >{b.data.text}</h3>)
                                                    
                                            }
                                        case 'code':
                                            let code =b.data.code
                                            let lang;
                                            if(b.data.code.substr(0,3) === '```'){
                                                lang = code.substr(3, code.substr(3).indexOf('`'))
                                                code = code.substr(code.indexOf('\n'))
                                                if(lang === 'html')lang = 'xml'
                                            }
                                            
                                            return (<div key={key} id={b.id}  className='code' >{code.split('\n').map((d,key)=>{
                                                return(
                                                    <div key={key} dangerouslySetInnerHTML={{__html:lang?hljs.highlight(d,{language: lang}).value:hljs.highlightAuto(d).value}}></div>
                                                )
                                            })}</div>)  
                                        case 'raw':
                                            return(<div key={key} id={b.id} dangerouslySetInnerHTML={{__html:b.data.html}}></div>)  
                                        case 'image':
                                            return(<div key={key} id={b.id} className={'img'+(b.data.withBorder?' withBorder':'')+(b.data.withBackground?' withBackground':'')+(b.data.stretched?' stretched':'')}>
                                                    <img src={b.data.file.url} alt={b.data.caption}></img>
                                                    <p>{b.data.caption}</p>
                                                </div> )
                                        default:
                                            return(<br key={key}></br>)
                                }
                            })}
                        </div>
                    </article>
                )
    }
}


export default Post