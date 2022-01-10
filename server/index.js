const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = express()
const port = 4000
const { auth } = require('./middleware/auth')
const { User } = require('./models/User')
const config = require('./config/key')

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
    useNewUrlParser:true, useUnifiedTopology:true
}).then(()=>{console.log('MongoDB Succcess...')}).catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World! it is  test~~')
})

app.get('/api/hello',(req,res) =>{
    res.send('Hello World this is React test~~')
})

app.post('/api/users/register', (req, res) => {

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({sucess:false, err})
        return res.status(200).json({sucess:true})
    })
}) 

app.post('/api/users/login', (req, res) => {

//요청된 이메일을 데이타베이스에서 찾는다
User.findOne({email:req.body.email}, (err,  user) =>{
     if (!user) {
         return res.json({loginSuccess:false, message:'이메일 주소 확인 요망'})
     }
     //console.log('user',user)
     //console.log('email',req.body.email)
// 자료가 있다면 비밀번호 같은지 확인
     user.comparePassword(req.body.password, (err, isMatch) =>{
        
        if(!isMatch) 
        return res.json({loginSuccess:false, message:"비밀번호가 다릅니다."})
        
        // 비밀번호가 맞다면 토큰 생성
        user.generateToken((err, user) =>{
            if(err) return res.status(400).send(err);
         
        //토큰을 쿠키에 저장한다.
            res.cookie("w_auth", user.token).status(200).json({loginSuccess: true,userId:user._id})  
         })
        })
    })
})

app.get('/api/users/auth', auth ,(req,res)=>{

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
})

app.get('/api/users/logout',auth,(req,res) =>{

    User.findOneAndUpdate({_id:req.user._id},{token:""},(err,user) =>{
        if(err) return res.json({success:false, err});
        return res.status(200).send({success:true})
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})