<template>
    <div :class="prefixCls">
        <CheckboxGroup v-model="model" @on-change="modelChange">
               <Tree-Node 
                v-for="(item, i) in data"
                :data="item"
                :keys="keys"
                :key="i">
            </Tree-Node>
        </CheckboxGroup>
    </div>
</template>

<script>
const prefixCls = 'x-tree'
import CheckboxGroup from '../Checkbox/CheckboxGroup'
import TreeNode from './Node'

export default {
    name: 'Tree',
    props: {
        data: {
            type: Array,
            default: []
        },
        value: {
            type: Array,
            default: []
        },
        keys: {
            type: Object,
            defult: {
                titleKey: 'title',
                childrenKey: 'children',
                valueKey: 'value'
            }
        },
        link: {
            type: Boolean,
            default: true
        },
        render: Function
    },
    data() {
        return {
            prefixCls: prefixCls,
            stateTree: this.data,
            model: this.value,
            checkedItem: '',
            nodeKeyItem: '',
            flatTree: []
        }
    },
    components: {
        TreeNode,
        CheckboxGroup
    },
    mounted() {
        this.flatTree = this.compileFlatState()
    },
    methods: {
        compileFlatState () {
            let keyCounter = 0
            let childrenKey = this.keys.childrenKey
            const flatTree = []
            function flattenChildren(node, parent) {
                node.nodeKey = keyCounter++;
                flatTree[node.nodeKey] = { node: node, nodeKey: node.nodeKey };
                if (typeof parent != 'undefined') {
                    flatTree[node.nodeKey].parent = parent.nodeKey;
                    flatTree[parent.nodeKey][childrenKey].push(node.nodeKey);
                }

                if (node[childrenKey]) {
                    flatTree[node.nodeKey][childrenKey] = [];
                    node[childrenKey].forEach(child => flattenChildren(child, node));
                }
            }
            this.stateTree.forEach(rootNode => {
                flattenChildren(rootNode);
            });
            return flatTree;
        },
        modelChange(data) {
            const {nodeKeyItem} = this
            const childrenKeyArr = this.flatTree[nodeKeyItem].children
            const parentKey = this.flatTree[nodeKeyItem].parent
            
            if (this.link && childrenKeyArr && childrenKeyArr.length) this.checkedDown(childrenKeyArr)
            if (this.link && !isNaN(parentKey)) this.checkedUp(this.flatTree[parentKey])

            this.$emit('input', data)
        },
        checkedDown(node) {
            const {valueKey} = this.keys

            node.forEach(i => {
                const chinldrenNode = this.flatTree[i].children
                const nodeValue = this.flatTree[i].node[valueKey]

                if (this.checkedItem) {
                    this.model.indexOf(nodeValue) < 0 ? this.model.push(nodeValue) : ''
                } else {
                    this.model.splice(this.model.indexOf(nodeValue), 1)
                }
                if (chinldrenNode && chinldrenNode.length) this.checkedDown(chinldrenNode)
            })
        },
        checkedUp(node) {
            const {valueKey} = this.keys
            const parentKey = node.parent
            const nodeValue = node.node[valueKey]
            let goUp = true

            if (this.checkedItem) {
                this.model.indexOf(nodeValue) < 0 ? this.model.push(nodeValue) : ''
            } else {
                for(let i = 0, len = node.children.length; i < len; i++) {
                    const itemValue = this.flatTree[node.children[i]].node[valueKey]
                    if (this.model.indexOf(itemValue) >= 0) {
                        goUp = false
                        break
                    }
                }
                goUp ? this.model.splice(this.model.indexOf(nodeValue), 1) : ''
            }
            if (!isNaN(parentKey) && goUp) this.checkedUp(this.flatTree[parentKey])
        }
    },
    watch: {
        stateTree() {
            this.flatTree = this.compileFlatState()
        }
    }
}
</script>

<style>
.x-tree ul, li{
    padding: 2px 0;
    margin: 0;
    list-style: none;
}
</style>


