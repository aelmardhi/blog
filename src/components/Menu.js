import './Menu.css'
import {Link}from 'react-router-dom'
function Menu(){
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <header className='row'>
            <h2>aelmardhi'sBlog</h2>
        <nav>
            <ul className='row'>
                <li><Link to="/">Blog</Link></li>
                <li><a  href="/">Home</a></li>
                { user?.username &&<li><Link to="new">New</Link></li>}
            </ul>
        </nav>
        </header>
    )
}

export default Menu;