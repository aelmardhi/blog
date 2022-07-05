// import logo from './logo.svg';
import './App.css';

import Menu from './components/Menu';
import Home from './components/Home';
import New from './components/New';
import Post from './components/Post'
import Edit from './components/Edit';

import {Route, Routes} from 'react-router-dom'

function App() {
  return (
    <div className="App">
      
      <Menu/>
      <main
      className='main'>
      <Routes>
        <Route  path="/"  element={<Home/>}/>
        <Route path='/new/' element={<New/>}/>
        <Route path='/post/:id' element={<Post/>}/>
        <Route path='/post/:id/edit' element={<Edit/>}/>
      </Routes>
      </main>
    </div>
  );
}

export default App;
