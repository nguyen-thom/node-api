'use strict'
var Ldap_Strategy = require('passport-ldapauth').Strategy;

const OPTS = {
    server: {
        url: 'ldap://10.190.201.151:389',
        bindDN: 'cn=xuanvinh,ou=Users,dc=dartslive,dc=com',
        bindCredentials: 'Tctav2017',
        searchBase: 'ou=Users',
        //searchFilter: '(cn={{username}})'
        searchFilter: '(objectclass=*)'
    }
};

module.exports = new Ldap_Strategy(OPTS);