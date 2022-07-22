import './New.css'
import React  from 'react';
import {Navigate} from 'react-router-dom'
import{withRouter} from './HOC'
import Loader from './Loader';

const LOADING_STATE = {loading:0, success:1, error:2, redirect:3}

class Edit extends React.Component{
    constructor(props){
         super(props)
         this.id = this.props.params.id 
        this.state = {
            title:'',
            public: false,
            editor:null,
            loadingState: LOADING_STATE.loading
        }

        this.user = JSON.parse(localStorage.getItem('user'))
        this.save = this.save.bind(this)
        this.titleChanged = this.titleChanged.bind(this)
        this.publicChanged = this.publicChanged.bind(this)
    }
    componentDidMount(){
        const EditorJS = require('@editorjs/editorjs')
        const Header = require( '@editorjs/header'); 
        const List = require( '@editorjs/list'); 
        const Code = require( '@editorjs/code'); 
        const Raw = require( '@editorjs/raw'); 
        const ImageTool = require( '@editorjs/image'); 

        

        fetch('/api/blog/post/'+this.id,{
            method: 'GET',
            headers: {
              'auth-token': this.user?.['auth-token'],
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        }).then(r=>r.json().then(d=>{
            console.log(d)
                this.setState({
                    title: d.title,
                    public: d.public,
                    loadingState: LOADING_STATE.success,
                })        
                setImmediate(()=>{
                    const editor = new EditorJS({
                        /**
                         * Id of Element that should contain Editor instance
                         */
                        autofocus: true,
                        holder: 'editor',
                        data: d,
                        tools: { 
                            header: Header, 
                            list: List, 
                            code:Code,
                            raw: Raw,
                            image: {
                                class: ImageTool,
                                config: {
                                  endpoints: {
                                    byFile: '/api/uploadImage/file', 
                                    byUrl: '/api/uploadImage/url',
                                  },
                                  additionalRequestHeaders:{
                                    'auth-token': this.user['auth-token']
                                  }
                                }
                              }
                        }, 
                        })

                this.setState({
                    editor
                })        
                    
                })
        })).catch(e=>{
            this.setState({
                loadingState: LOADING_STATE.error
            })
        })

        
    }
    
    async save (){
        const data =  await this.state.editor.save()
        data.title = this.state.title
        data.project = 'none'
        data.author = this.user._id
        data.public = this.state.public
        fetch('/api/blog/post/'+this.id+'/edit',{
            method: 'POST',
            headers: {
              'auth-token':this.user['auth-token'],
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }).then((d)=>
            this.setState({
                loadingState: LOADING_STATE.redirect
            })
        ).catch(e=>{
            alert('Did not save: some error happend')
        })

        console.log( data)
      }
      titleChanged (e){
        this.setState({title:e.target.value})
      }
      publicChanged (e){
        this.setState({public:e.target.checked})
      }
      render(){
        switch(this.state.loadingState){
            case LOADING_STATE.redirect:
                return(<Navigate to={'/post/'+this.id}></Navigate>)
            case LOADING_STATE.loading:
                return( <Loader></Loader>)
            case LOADING_STATE.error:
                return(<div className='error'>
                    <h3>Erorr: could not load</h3>
                </div>)
            case LOADING_STATE.success:
            default:
                return (    
                    <article>
                        { !this.user && <Navigate to={'/blog'}></Navigate>}
                        <fieldset>
                            <label htmlFor='titleInput'>Title</label>
                            <input type='text' name='title' id='titleInput' value={this.state.title} onChange={this.titleChanged}></input>
                        </fieldset>
                        <fieldset>
                            <label htmlFor='publicInput'>Public</label>
                            <input type='checkbox' name='public' id='publicInput' checked={this.state.public} onChange={this.publicChanged}></input>
                        </fieldset>
                        <div id='editor'></div>
                        <button onClick={this.save}>SAVE</button>
                    </article>
                )
        }
      }
    
}

export default withRouter(Edit);