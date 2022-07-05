import './PostHeader.css'

function PostHeader (props){
    return (
        <div className='row postHeader'>
                        <img className='profileImg' src={props.post.author.profileImage} alt={'profile image of'+props.post.author.name}></img>
                        <div className='column titlePanel'>
                            <h3>{props.post.title}</h3>
                            <div className='row'>
                                <h4>{props.post.author.name}</h4>
                                <h4>{props.post.project}</h4>
                                <h4>{new Date(props.post.time).toISOString().substring(0,19).replace('T',' ')}</h4>
                            </div>
                        </div>
                    </div>
    )
}
export default PostHeader