<template>
<div class="group-box">
     <div style="font-size:1.3rem;font-weight:600;text-align:center;">
		新建群名：<Input size="small" placeholder="群名" v-model="newGroupName" style="width:260px;border-radius:0;border:0;"/>
	 <Button @click="chatGroupSend()" size="small" style="font-size:1.3rem;font-weight:600;text-align:center;">创建</Button>
	 
	 </div>
		
	 <div class= "create-group-box" >
		<div class = "im-chat-main-left">
			<ul id="orgTree" class="ztree" style="width:260px;"></ul>
		</div>
		<div  class="im-chat-users">
             <ul class="chat-user-list">
				<li class="user" v-for="item in groupUserList">
					<img :src="[host + item.avatar]" alt="头像">
						<b>{{ item.name }}</b>
                        <Icon type="md-close" @click="delGroupUser(item)"  v-if="item.userId != masterUerId"></Icon>
                 </li>
				
             </ul>
		</div>
	</div>
	
</div>
</template>
<script type="text/javascript" src="../../../utils/jquery-1.4.4.min.js"></script>
<script type="text/javascript" src="../../../utils/jquery.ztree.core.min.js"></script>
<script>
 import conf from '../conf';
 import RequestUtils from '../../../utils/RequestUtils';
 import StoreUtils from '../../../utils/StoreUtils';
 
 Array.prototype.removeById = function(val) {
   for(var i = 0; i < this.length; i++) {
     if(this[i].userId == val.userId) {
         this.splice(i, 1);
          break;
    }
   }
 };
export default {
  name: 'group',
  data() {
	  var _this = this;
	  let access_token = StoreUtils.getAccessToken();
      return {
        userList: [],
		groupUserList: [],
        chatGroupUsers: [],
		masterUerId:this.$store.state.user.id,
        host: conf.getHostUrl()
		,newGroupName:''
	    ,setting:{
			async: {
				enable: true,
				url:conf.getOrgListUrl()+'?access_token='+access_token,
				autoParam:["id"]
			},
            data:{
                 simpleData:{
					enable: true,
					idKey: "id",
					pIdKey: "pid",
					rootPId: null
                  }
               },
		   callback: {
				onClick:function(event,treeId,treeNode){
					if(!treeNode.isParent){
						var selectUser = {'name':treeNode.name,'avatar':'/img/default-user.png','userId':treeNode.id};
						if(JSON.stringify( _this.groupUserList).indexOf(JSON.stringify(selectUser))==-1){
							 _this.groupUserList.push(selectUser);	
						}
				  }
				}
			}
		 
		 }		
      };
    },
   methods: {
	  chatGroupSend:function(){
	    let self = this;
		let requestApi = RequestUtils.getInstance();
		let chatGroupInfo = new FormData();

		var chatGroupList = self.$store.state.chatGroupList.slice();

		if(!self.newGroupName){
			self.$Message.error('请填写群名');
			return;
		}
		
		if(self.groupUserList.length<2){
			self.$Message.error('请添加群成员');
			return;
		}

		var newGroup = {'name':self.newGroupName,'master':self.$store.state.user.id,'avatar':'/img/group-img.png'};
		chatGroupInfo.set('imChatGroup',JSON.stringify(newGroup));
		chatGroupInfo.set('groupUsers',JSON.stringify(self.groupUserList));
		
		requestApi
          .request(conf.getCreateGroupUrl(), chatGroupInfo)
          .then(response => {
            return response.json();
          })
		  .then(json => {
           if ('0' === json.resultCode) {
              var newChatId = json.message;
			  newGroup.id=newChatId;
			  chatGroupList.push(newGroup);
			  
			  self.$store.commit('setChatGroupList', chatGroupList);
			  self.$Message.success('创建成功群:【'+newGroup.name+'】');
			  self.newGroupName='';
			  self.groupUserList=[{'name':self.$store.state.user.name,'avatar':'/img/default-user.png','userId':self.$store.state.user.id}];
            } else {
              self.$Message.error(json.message);
            }
          });
	  },
	  delGroupUser:function(user) {
       this.groupUserList.removeById(user);
      },
	  initTree:function(){
		let self  = this;
		let requestApi = RequestUtils.getInstance();
		let param = new FormData();
        param.set('id','0');		
		requestApi
          .request(conf.getOrgInitUrl(), param)
          .then(response => {
            return response.json();
          })
		  .then(json => {
              var zNodes = json;
			  $.fn.zTree.init($("#orgTree"), self.setting,zNodes);
		 });
	  }
    },
	created: function() {
      let self = this;
      let users = self.$store.state.userFriendList;
      for (let group of users) {
        for (let user of group.userList) {
          self.userList.push(user);
        }
      }
    },
	mounted(){
      this.initTree();
	  this.groupUserList.push({'name':this.$store.state.user.name,'avatar':'/img/default-user.png','userId':this.$store.state.user.id});
    }
};
</script>

<style lang="scss" scoped>
    @import '../../../../../static/styles/theme';
    @import '../../../../../static/styles/zTreeStyle/zTreeStyle.css';
	.group-box{
        height: 100% ;
		margin-top: 4rem;
	}
	.create-group-box {
        flex: 1;
        display: flex;
        flex-direction: row;
        height: 100% ;

        .im-chat-main-left {
            flex: 4;
            display: flex;
            flex-direction: column;

            .im-chat-main-box {
                flex: 1;
                padding-top: 0rem;
                overflow-x: hidden;
                overflow-y: auto;
            }
        }

     .im-chat-users {
            flex: 6;
            border-left: 1px solid #cccccc;
            overflow-y: scroll;
			
		 li {
            list-style: none;
            position: relative;
            font-size: 1.2rem;
            cursor: pointer;
            font-weight: 200;
            margin-bottom: 0rem;

            h5 {
                padding: 0.5rem 0;
                cursor: pointer;
                font-size: 1.3rem;
                font-weight: 200;

                i {
                    vertical-align: baseline;
                }
            }

            img {
                width: 2.4rem;
                height: 2.4rem;
                position: absolute;
                top: 0.4rem;
                left: 2rem;
            }

            b {
                position: absolute;
                font-size: 1.3rem;
                left: 4.8rem;
                overflow: hidden;
                text-overflow: ellipsis;
                font-weight: 600;
                top: 0.6rem;
            }
        }
			
		.user {
            height: 3.2rem;
            position: relative;

            &:hover {
                background-color: $color-gray !important;

                & > i {
                    color: $color-default;
                    background-color: $color-write;
                }
            }

            .active {
                background-color: $color-gray !important;
            }

            & > i {
                position: absolute;
                right: 1rem;
                bottom: 1.6rem;
                cursor: pointer;
                border-radius: 50%;
                padding: 0.2rem;
                text-align: center;
                color: $color-light-gray;

                &:hover {
                    color: $color-default;
                    background-color: $color-write;
                }
            }
        }
			
			
        }
    }
	
	.im-chat-send-group {
		height:3rem;
		position:absolute;
		bottom:0;	
		font-size:1.3rem;
		text-align:right;
	}
		
</style>
