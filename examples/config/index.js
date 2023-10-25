import form from './form.json5'

export default {
  form: form,
  mainHead: 'Скважина',
  local: {
    cancel: 'Отменить',
    apply: 'Применить',
    submit: 'Отправить',
    clear: 'Отчистить',
    confirm: 'Подтвердить',
    requestMessage: 'Отправка...',
    sentMessage: 'Успешно отправлено.',
    errorMessage: 'Ошибка',
    clearMessage: 'Вы хотите очистить все поля в форме?',
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
      return obj.message || this.local.sentMessage
    } catch (err) {
      return this.local.errorMessage
    }
  }
}