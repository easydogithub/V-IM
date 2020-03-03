<template>
    <div>
        <ul>
            <li class="tree-li">
                <span class="icon-right" @click="showDown=!showDown">
                    <img
                        v-if="data[keys.childrenKey]&& data[keys.childrenKey].length"
                        :style="iconRightStyle"
                        :src="src">
                </span>
                <Checkbox :label="data[keys.valueKey]" @input="checkChange"><span>{{data[keys.titleKey]}}</span></Checkbox>
                <Render v-if="data.render" :render="data.render" :data="data" :node="node"></Render>
                <Render v-if="isParentRender" :render="parentRender" :data="data" :node="node"></Render>
            </li>
            
            <Tree-node
                :style="treeNodeStyle"
                class="tree-node"
                v-if="data[keys.childrenKey].length"
                v-for="(item, i) in data[keys.childrenKey]"
                :keys="keys"
                :key="i"
                :data="item">
            </Tree-node>
        </ul>
    </div>
</template>

<script>
import Checkbox from '../Checkbox/Checkbox'
import Render from './render'
import src from '../../assets/dropright.svg'

export default {
    name: 'TreeNode',
    props: {
        data: {
            type: Object,
            default: {}
        },
        keys: {
            type: Object,
            defult: {
                titleKey: 'title',
                childrenKey: 'children',
                valueKey: 'value'
            }
        }
    },
    computed: {
        treeNodeStyle() {
            const showDown = this.showDown
            return {
                maxHeight: showDown ? `${this.height}px` : '0',
                overflow: showDown ? '' : 'hidden',
                opacity: showDown ? '1' : '0'
            }
        },
        iconRightStyle() {
            return {
                transform: this.showDown ? 'rotate(90deg)' : 'rotate(0)'
            }
        },
        isParentRender() {
            const tree = this.findComponentUpward(this, 'Tree')
            return tree && tree.render
        },
        parentRender() {
            const tree = this.findComponentUpward(this, 'Tree')
           if (tree && tree.render) {
               return tree.render
           } else {
               return null
           }
        },
        node () {
            const tree = this.findComponentUpward(this, 'Tree')
            if (tree) {
                // 将所有的 node（即flatState）和当前 node 都传递
                return [tree.flatTree, tree.flatTree.find(item => item.nodeKey === this.data.nodeKey)]
            } else {
                return []
            }
        },
    },
    components: {
        Checkbox,
        Render
    },
    data() {
        return {
            nodeKey: '',
            src: src,
            showDown: typeof this.data.showDown === 'boolean' ? this.data.showDown : true,
            height: 'auto'
        }
    },
    mounted() {
        this.height = this.$el.offsetHeight
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
        checkChange(value) {
            const tree = this.findComponentUpward(this, 'Tree')
            tree.nodeKeyItem = this.data.nodeKey
            tree.checkedItem = value
        }
    }
}
</script>

<style>
.tree-node{
    margin-left: 20px;
    transition: all .2s;
}
.icon-right{
    padding-right: 5px;
    vertical-align: middle;
    display: inline-block;
    width: 10px;
    cursor: pointer;
    
}
.icon-right img{
    width: 10px;
    transition: all .2s;
}
.tree-li{
    font-size: 14px;
}
</style>


