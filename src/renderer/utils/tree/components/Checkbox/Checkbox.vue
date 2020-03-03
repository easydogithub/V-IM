<template>
  <label :class="labelClasses">
    <span :class="outerClasses">
        <span :class="checkboxClasses">
            <input
                v-if="group"
                type="checkbox"
                :value="label"
                v-model="model"
                :class="inputClasses"
                :disabled="disabled"
                @change="inputChange">
            <input
                v-else
                type="checkbox"
                :class="inputClasses"
                :checked="checkedValue"
                :disabled="disabled"
                @change="inputChange">
        </span>
    </span>
    <slot><span v-if="showSlot">{{ label }}</span></slot>
  </label>
</template>


<script>
const prefixCls = 'x-checkbox'
export default {
    name: 'Checkbox',
    props: {
        value: {
            type: [String, Number, Boolean],
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        label: {
            type: [String, Number, Boolean]
        },
        trueValue: {
            type: [String, Number, Boolean],
            default: true
        },
        falseValue: {
            type: [String, Number, Boolean],
            default: false
        }
    },
    data() {
        return {
            checkedValue: this.value,
            showSlot: true,
            group: false,
            model: [],
            parent: this.findComponentUpward(this, 'CheckboxGroup'),
        }
    },
    computed: {
        inputClasses() {
            return `${prefixCls}-input`
        },
        labelClasses() {
            return `${prefixCls}-label`
        },
        outerClasses() {
            return [
                `${prefixCls}-outer`,
                {
                    [`${prefixCls}-outer-checked`]: this.checkedValue,
                    [`${prefixCls}-outer-disabled`]: this.disabled,
                    // [`${prefixCls}-indeterminate`]: this.indeterminate
                }
            ]
        },
        checkboxClasses() {
            return [
                `${prefixCls}`,
                {
                    [`${prefixCls}-checked`]: this.checkedValue
                }
            ]
        }
    },
    mounted() {
        this.parent = this.findComponentUpward(this, 'CheckboxGroup')
        if (this.parent) {
            this.group = true
            this.parent.updateModel()
        }
    },
    methods: {
        findComponentUpward(context, componentName, componentNames) {
            if (typeof componentName === 'string') {
                componentNames = [componentName]
            } else {
                componentNames = componentName
            }

            let parent = context.$parent
            let name = parent.$options.name
            while (parent && (!name || componentNames.indexOf(name) < 0)) {
                parent = parent.$parent
                if (parent) name = parent.$options.name
            }
            return parent
        },
        inputChange(event) {
            let checked = event.target.checked
            let value = checked ? this.trueValue : this.falseValue
            this.checkedValue = checked
            this.$emit('input', value)

            if (this.group) {
                this.parent.change(this.model)
            }
        }
    }
}
</script>

<style>
.x-checkbox{
    width: 12px;
    height: 12px;
    display: inline-block;
    position: relative;
    border: 1px solid #aeaeae;
    border-radius: 2px;
    transition: all .3s;
    margin-right: 4px;
    background: #fff;
    cursor: pointer;
}

.x-checkbox:hover{
    border: 1px solid #aaa;
}

.x-checkbox-checked{
    cursor: pointer;
    border: 1px solid #008cff;
    background: #008cff;
}
.x-checkbox-checked:hover{
    border: 1px solid #008cff;
}
.x-checkbox-checked::after{
    content: '';
    width: 2px;
    height: 6px;
    display: block;
    position: absolute;
    top: 1px;
    left: 4px;
    border: 2px solid #fff;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
}

.x-checkbox-outer-disabled .x-checkbox-checked{
    border: 1px solid #aeaeae;
    background: #e7e7e7;
}

.x-checkbox-outer-disabled .x-checkbox-checked::after{
    border-color: #b9b9b9;
}

.x-checkbox-outer-disabled .x-checkbox{
    background: #e7e7e7;
    cursor: pointer;
}

.x-checkbox-outer{
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
    cursor: pointer;
    line-height: 1;
    position: relative;
}

.x-checkbox-label{
    cursor: pointer;
    font-size: 14px;
    display: inline-block;
    margin-right: 8px;
}

.x-checkbox-input{
    cursor: pointer;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: 0;
    opacity: 0;
}
</style>

