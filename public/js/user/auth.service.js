(function() {
  'use strict'

  angular.module('app')
    .service('authService', service)

  service.$inject = ['$http','__env']
  function service($http, __env) {
    // let isAuthenticated = false;
    let authToken;
    
    this.checkCredentials = checkCredentials;
    this.authenticate = authenticate;
    this.loadUserCredentials = loadUserCredentials;
    this.storeUserCredentials = storeUserCredentials;
    this.useCredentials = useCredentials;
    this.destroyUserCredentials = destroyUserCredentials;

    function authenticate(login) {
      return $http.post(`${__env.apiUrl}/api/login`, login).then((response) => {
        storeUserCredentials(response.data.token);
        return response.data;
      })
    }
        
    function loadUserCredentials() {
      var token = window.localStorage.getItem(__env.authTokenKey);
      if (token) {
        useCredentials(token);
      }
    }
   
    function checkCredentials() {
      var token = window.localStorage.getItem(__env.authTokenKey);
      if (token) {
        return true;
      }
      return false;
    }
    
    function storeUserCredentials(token) {
      window.localStorage.setItem(__env.authTokenKey, token);
      useCredentials(token);
    }
   
    function useCredentials(token) {
      authToken = token;
      
      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken;
    }
   
    function destroyUserCredentials() {
      authToken = undefined;
      $http.defaults.headers.common.Authorization = undefined;
      window.localStorage.removeItem(__env.authTokenKey);
    }
   
    function register(user) {
      // return $q(function(resolve, reject) {
      //   $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
      //     if (result.data.success) {
      //       resolve(result.data.msg);
      //     } else {
      //       reject(result.data.msg);
      //     }
      //   });
      // });
    };
   
    function logout() {
      destroyUserCredentials();
    };
   
    loadUserCredentials();
   
  }

}());