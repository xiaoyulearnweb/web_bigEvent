$(function() {
  var form = layui.form
  var layer = layui.layer

  form.verify({
    nickname: function(value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间!'
      }
    }
  })

  initUserInfo()

  // 初始化用户基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('初始化用户信息失败！')
        }
        // console.log(res);
        // 调用 form.val() 快速为表单赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 重置按钮
  $('#btnReset').on('click', function(e) {
    // 阻止表单的默认重置行为
    e.preventDefault();
    // 再次调用初始化用户基本信息
    initUserInfo()
  })

  // 提交修改，修改用户信息
  $('.layui-form').on('submit', function(e) {
    // 阻止表单的默认提交行为
    e.preventDefault();
    // 获取用户基本信息
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')

        // 调用父页面中的方法，重新渲染用户的头像和用户名
        window.parent.getUserInfo()
      }
    })
  })
})