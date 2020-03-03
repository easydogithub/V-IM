import XCheckbox from './components/Checkbox'
import XCheckboxGroup from './components/CheckboxGroup'
import XTree from './components/Tree'

const components = {
    XCheckbox,
    XCheckboxGroup,
    XTree
}

const install = function(Vue) {
    if (install.installed) return
    Object.keys(components).forEach(component => {
        Vue.component(component, components[component])
    })
}

export default {
    install,
    XCheckbox,
    XCheckboxGroup,
    XTree
}