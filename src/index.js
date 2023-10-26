import './components/UI/general.css'
import './styles.css'
import Form from './form'
import { jsonToFormData } from './utils'

function createForm(options) {
    const form = new Form(options)
    return {
        mount: form.create.bind(form),
        unmount: form.unmount.bind(form),
        element: form.element
    }
}

export { createForm, jsonToFormData }

