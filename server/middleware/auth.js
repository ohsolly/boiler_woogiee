const { User } = require('../models/User')

let auth = (req, res, next) =>{
//인증 처리를 하기위해 클라이언트 쿠키에서 토큰 가지고 온다

    let token = req.cookies.w_auth;
    
    User.findByToken(token, (err, user)=>{
        if (err) throw err;
        if(!user) return res.json({isAuth: false, error: true})

        req.token = token;
        req.user = user;
        next();
    })

//토큰을 복호화 한후 유저를 찾는다.

//유저가 있으면 인증 완료

}

module.exports ={ auth }