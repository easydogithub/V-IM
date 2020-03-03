<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'CheckboxGroup',
    props: {
        value: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            currentValue: this.value,
            children: []
        }
    },
    mounted() {
        this.updateModel()
    },
    methods: {
        findComponentsDownward(context, componentName) {
            return context.$children.reduce((components, child) => {
                if (child.$options.name === componentName) components.push(child);
                const foundChilds = this.findComponentsDownward(child, componentName);
                return components.concat(foundChilds);
            }, []);
        },
        updateModel() {
            this.children = this.findComponentsDownward(this, 'Checkbox')

            this.children.forEach(child => {
                child.model = this.currentValue
                child.checkedValue = this.value.indexOf(child.label) >= 0
            })
        },
        change(data) {
            this.currentValue = data
            this.$emit('input', data)
            this.$emit('on-change', data)
        }
    },
    watch: {
        currentValue () {
            this.updateModel()
        }
    }
}
</script>

