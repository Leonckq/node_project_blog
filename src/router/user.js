const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('./../db/redis')
const isGet = type => type === 'GET'
const isPost = type => type === 'POST'
const apiUrl = `/api/user`
const handleUserRouter = (req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]
  //登录
  if (isGet(method) && path === `${apiUrl}/login`) {

    // let data = ''
    // return new Promise((resolve, reject) => {
    //   req.on('data', chunk => {
    //     data += chunk
    //   })

    //   req.on('end', () => {
    //     data = JSON.parse(data)
    //     req.body = data
    //     const { username, password } = data
        
    //     return login(username, password).then(data => {
    //       if (data.username) {
    //         resolve(new SuccessModel())
    //         // return new SuccessModel()
    //       }
    //       reject(new ErrorModel('登录失败'))
    //       // return new ErrorModel('登录失败')
    //     })
    //   })
    // })
    const { username, password } = req.query
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        console.log('req.session is', req.session)
        set(req.sessionId, req.session)
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
    
  }

  if (isGet(method) && path === `${apiUrl}/login-test`) {
    console.log('req.session---->', req.session)
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }))
    }
    return Promise.reject(new ErrorModel('尚未登录'))
  }

}

module.exports = handleUserRouter