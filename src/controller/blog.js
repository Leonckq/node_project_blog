const { exec } = require('../db/mysql')


const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author='${author}' `
  }
  if (keyword) {
    sql += `and title like '%${keyword}%' `
  }
  sql += 'order by createtime desc;'
  //返回promise
  return exec(sql)
}

const getDetail = (id) => {
  let sql = `select * from blogs where id='${id}'`
  return exec(sql).then(res => {
    return res[0]
  })
}

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象， 包含title， content， author属性
  const { title, content, author } = blogData
  const createTime = Date.now()
  const sql = `
    insert into blogs (title, content, author, createtime)
    values
    ('${title}', '${content}', '${author}', ${createTime});
  `
  return exec(sql).then(res => {
    // console.log(res);
    return {
      id: res.insertId
    }
    // return res
  })
}

const updateBlog = (id, blogData = {}) => {
  id = Number(id)
  const { title, content } = blogData
  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id};
  `
  return exec(sql).then(updateData => {
    console.log('updateData=======>', updateData)
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

const delBlog = (id, author) => {
  // const sql = `
  //   delete from blogs where id=${Number(id)} and author='${author}';
  // `
  const sql = `
    delete from blogs where id=${Number(id)};
  `
  return exec(sql).then(deleteData => {
    console.log('deleteData=======>', deleteData)
    if (deleteData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}