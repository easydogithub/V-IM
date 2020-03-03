<template>
    <div class="chat-panel">
        <div class="chat-box-list">
            <Search class="search-box" @showChat="showChat"></Search>
            
            <el-tree :load="loadNode" accordion lazy :props="props" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <Icon type="md-star-outline" v-show="data.type === '2' && data.isfav === null" @click.stop="favorite(data)"/>
                <Icon type="md-star" v-show="data.type === '2' && !(data.isfav === null)" @click.stop="favorite(data)"/>
                <Icon v-if="data.type === '1'" type="ios-jet-outline" />
                <Icon v-if="data.type === '2'" type="ios-person-outline" />
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
        </div>
        <div class="chat-box">
            <Top></Top>
            <Welcome></Welcome>
        </div>
    </div>
</template>
<script>
  import Search from '../components/search.vue';
  import Top from '../components/top.vue';
  import UserChat from '../components/chat.vue';
  import Welcome from '../components/welcome.vue';
  import conf from '../conf';
  import RequestUtils from '../../../utils/RequestUtils';
  import { ChatListUtils, MessageTargetType } from '../../../utils/ChatUtils';

  export default {
  components: {
    Search,
    Top,
    UserChat,
    Welcome
  },
  computed: {

  },
  data() {
    return {
      host: conf.getHostUrl(),
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        props: {
          label: 'name',
          children: 'children',
          isLeaf: 'isleaf'
        }
    };
  },
  methods: {
    // 打开一个聊天对话框
    showChat: function(user) {
      let self = this;
      self.$router.push({
        path: '/index/chatBox/',
        query: { chat:  ChatListUtils.resetChatList(self, user, conf.getHostUrl(), MessageTargetType.FRIEND) }
      });
    },
    handleNodeClick(data) {
        console.log(data);
        //this.$options.methods.showChat(data.user);
        if (data.type === '2') {
          let self = this;
          self.$router.push({
            path: '/index/chatBox/',
            query: { chat:  ChatListUtils.resetChatList(self, data.user, conf.getHostUrl(), MessageTargetType.FRIEND) }
          });
        }
        
    },
    loadNode(node, resolve) {
        let param = new FormData();
        let code = '';
        if (node.level != 0) {
          code = node.data.code;
          if (node.data.type === '2') {
            return resolve([]);
          }
        }
        param.set('code', code);
        RequestUtils
          .getInstance()
          .request(conf.getPeoplesUrl(), param)
          .then(response => {
             //console.log(response.json());
             return response.json();
          }).then(json => {
            let json1 = json.map(o => {
               o.isleaf = o.type === '2' ? true : false;
               return o;
            });
            
            return json1;
          }
          ).then(json => {
            resolve(json);
          });
    },
    favorite(data) {
        console.log('favorite:' + data);
        let param = new FormData();
        let user = data.user;
        param.set('id',user.id);
        param.set('name',user.name);
        param.set('avatar',user.avatar);
        param.set('sign',user.sign);
        param.set('mobile',user.mobile);
        param.set('email',user.email);
        RequestUtils
          .getInstance()
          .request(conf.getFavUrl(),param)
          .then(response => {
            return response.json();
          }).then(json => {
            console.log(json);
            let friendList = this.$store.state.userFriendList.map(o => {
              if (o.name === '标星用户') {
                if (json.action === 'a') {
                  o.userList.push(user);
                } else {
                  for (var i = 0; i < o.userList.length; i++) {
                    if (o.userList[i].id == user.id) {
                      o.userList.splice(i,1);
                      break;
                    }
                  }

                }
                
              }
              return o;
            });
            this.$store.commit('setUserFriendList', friendList);
          })
        //data.type = '1';
        let fav = data.isfav;
        if(fav === null) {
          data.isfav = '1';
        } else {
          data.isfav = null;
        }
    }
  }
};
</script>
<style lang="scss" scoped>
@import '../../../../../static/styles/theme';

.ivu-tabs-content {
  height: 100%;
}

.chat-panel {
  width: 26rem;
  background-color: $color-light-gray;
  height: 100%;
  display: flex;
  flex-direction: row;

  .chat-box {
    flex: 1;
    background-color: $color-box-bg;
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .chat-box-list {
    height: 100%;
    width: 22rem;
    display: flex;
    flex-direction: column;

    .search-box {
      margin: 1.5rem;
      width: 19rem;
    }
  }
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
  }

</style>
