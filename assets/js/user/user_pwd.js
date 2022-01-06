$(function() {
  var form = layui.form

  form.verify({
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    samePwd: function(value) {
      if (value === $('[name=oldPwd]').val()) {
        return '新密码不能和原密码相同！'
      }
    },
    rePwd: function(value) {
      if (value !== $('[name=newPwd]').val()) {
        return '输入的两次新密码不相同！'
      }
    }
  })

  // 提交修改密码
  $('.layui-form').on('submit', function(e) {
    // 阻止默认提交行为
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: $(this).serialize(),
      success: function(res) {
        if (res.status !== 0) {
          return layui.layer.msg(res.message)
        }
        layui.layer.msg('密码更改成功！')
          // 重置表单
        $('.layui-form')[0].reset()
      }
    })
  })
})