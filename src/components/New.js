import './New.css'
import React  from 'react';
import {Navigate} from 'react-router-dom'

const LOADING_STATE = {loading:0, success:1, error:2, redirect:3}

class New extends React.Component{
    constructor(props){
         super(props)
        this.state = {
            id:'',
            loadingState: LOADING_STATE.success,
            title:'',
            public: false,
            editor:null,
        }

        this.user = JSON.parse(localStorage.getItem('user'))
        this.save = this.save.bind(this)
        this.titleChanged = this.titleChanged.bind(this)
        this.publicChanged = this.publicChanged.bind(this)
    }
    componentDidMount(){
        console.log(this.context)
        // if(!this.user) Navigate({to:'/blog'});
        const EditorJS = require('@editorjs/editorjs')
        const Header = require( '@editorjs/header'); 
        const List = require( '@editorjs/list'); 
        const Code = require( '@editorjs/code'); 
        const Raw = require( '@editorjs/raw'); 
        const ImageTool = require( '@editorjs/image'); 
        const editor = new EditorJS({
        /**
         * Id of Element that should contain Editor instance
         */
        autofocus: true,
        holder: 'editor',
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

    }
    
    async save (){
        const data =  await this.state.editor.save()
        data.title = this.state.title
        data.project = 'none'
        data.author = this.user._id
        data.public = this.state.public
        fetch('/api/blog/new',{
            method: 'POST',
            headers: {
              'auth-token':this.user['auth-token'],
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        }).then(r=>r.json().then(d=>{
          this.setState({
            id: d.id,
            loadingState: LOADING_STATE.redirect
          })
        })).catch(e=>{
          alert('Didn\'t save: some error happend')
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
              return(<Navigate to={'/post/'+this.state.id}></Navigate>)
          
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

export default New;