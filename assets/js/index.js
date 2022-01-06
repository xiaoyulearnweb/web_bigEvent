$(function() {
  // 调用 getUserInfo 获取用户基本信息
  getUserInfo()

  var layer = layui.layer
    // 点击退出事件
  $('#btnLogout').on('click', function() {
    // 提示框
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
      //do something
      // 清空本地存储的 token
      localStorage.removeItem('token')
        // 重新跳转到登录页面
      location.href = '/login.html'

      // 关闭询问框
      layer.close(index);
    });
  })
})

// 获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers 就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function(res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // console.log(res);
      // 调用 renderAvatar 渲染用户头像
      renderAvatar(res.data)
    }
  })
}

// 渲染用户头像
function renderAvatar(user) {
  // 获取用户头像
  var name = user.nickname || user.username
    // 设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
  if (user.user_pic !== null) {
    // 渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    $('.layui-nav-img').hide()
    var firstWord = name[0].toUpperCase()
    $('.text-avatar').html(firstWord)
  }
}