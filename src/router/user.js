const isGet = type => type === 'GET'
const isPost = type => type === 'POST'
const apiUrl = `/api/user`
const handleUserRouter = (req, res) => {
  const method = req.method
  const url = req.url
  const path = url.split('?')[0]

  //登录
  if (isPost(method) && path === `${apiUrl}/login`) {
    return {
      msg: '博客列表'
    }
  }

}

module.exports = handleUserRouter