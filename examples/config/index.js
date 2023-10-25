import form from './form.json5'

export default {
  form: form,
  mainHead: 'Скважина',
  local: {
    cancel: 'Отменить',
    apply: 'Применить',
    submit: 'Отправить',
    request: 'Отправка...',
    sent: 'Успешно отправлено.',
    error: 'Ошибка'
  },
  send: async function (values) {
    try {
      const res = await fetch('https://foo', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      const obj = await res.json()
      return obj.message || this.local.sent
    } catch (err) {
      return this.local.error
    }
  }
}