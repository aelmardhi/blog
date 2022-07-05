import {Router} from 'express'

const posts = [{
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
}];

const router = Router()

router.get('/',(req, res)=>{
    res.send(posts)
})

router.post('/new', (req,res) =>{
    console.log(req.body)
    const data = req.body
    posts.push(req.body)
})

export default router;