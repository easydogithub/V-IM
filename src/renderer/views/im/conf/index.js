export default {
  app_name: 'V-IM',
  http_protocol: 'http',
  http_port: 7003,
  ws_port: 7001,
  init: '/api/user/init',
  his_url: '/api/message/list',
  chat_users_url: '/api/user/chatUserList',
  peoples_url: '/api/people/list',
  token_path: '/oauth/token',
  register_url: '/register',
  ws_protocol: 'ws',
  create_group_url:'/api/chatGroup/createChatGroup',
  org_init_url: '/api/chatGroup/initOrgTree',
  org_list_url: '/api/chatGroup/orgList',
  fav_url: '/api/people/fav',
  getHostUrl: function() {
    return this.http_protocol + '://' + localStorage.getItem('host') + ':' + this.http_port;
  },
  getTokenUrl: function() {
    return this.getHostUrl() + this.token_path;
  },
  getInitUrl: function() {
    return this.getHostUrl() + this.init;
  },
  getChatUsersUrl: function() {
    return this.getHostUrl() + this.chat_users_url;
  },
  getPeoplesUrl: function() {
    return this.getHostUrl() + this.peoples_url;
  },
  getHisUrl: function() {
    return this.getHostUrl() + this.his_url;
  },
  getRegisterUrl: function() {
    return this.getHostUrl() + this.register_url;
  },
  getWsUrl: function() {
    return this.ws_protocol + '://' + localStorage.getItem('host') + ':' + this.ws_port;
  },
  getCreateGroupUrl: function() {
    return this.getHostUrl() + this.create_group_url;
  },
  getOrgInitUrl: function() {
    return this.getHostUrl() + this.org_init_url;
  },
  getOrgListUrl: function() {
    return this.getHostUrl() + this.org_list_url;
  },
  getFavUrl: function() {
    return this.getHostUrl() + this.fav_url;
  }
};
