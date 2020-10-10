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
  if (isPost(method) && path === `${apiUrl}/login`) {
    const { username, password } = req.body
    const result = login(username, password)
    return result.then(data => {
      if (data.username) {
        // 设置session
        req.session.username = data.username
        req.session.realname = data.realname
        set(req.sessionId, req.session)
        return new SuccessModel()
      }
      return new ErrorModel('登录失败')
    })
    
  }

  if (isGet(method) && path === `${apiUrl}/login-test`) {
    if (req.session.username) {
      return Promise.resolve(new SuccessModel({
        session: req.session
      }))
    }
    return Promise.reject(new ErrorModel('尚未登录'))
  }

}

module.exports = handleUserRouter