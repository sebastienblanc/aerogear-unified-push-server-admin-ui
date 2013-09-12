document.write( '<div id="ember-testing-container"><div id="ember-testing"></div></div>' );

Ember.testing = true;

App.rootElement = '#ember-testing';
App.setupForTesting();
App.injectTestHelpers();

function exists( selector ) {
    return !!find( selector ).length;
}

function missing( selector ) {
    var error = "element " + selector + " found (should be missing)";
    throws( function () {
        find( selector );
    }, error );
}

var apps = [
    {
        "id": "4028818b3fe37e75013fe38200200000",
        "name": "Cool App 1",
        "description": "A Cool App for testing",
        "pushApplicationID": "12345",
        "masterSecret": "3ababa8f-cc35-455b-8fc1-311ffe206538",
        "developer": "admin",
        "androidVariants": [
            {
                "id": "4028818b3fe37e75013fe3828bfc0001",
                "name": "Android Version",
                "description": "An Android Variant",
                "variantID": "12345",
                "secret": "12345",
                "developer": "admin",
                "installations": [
                    {
                        "id": "4028818b3fe37e75013fe38a65ae0002",
                        "deviceToken": "1234",
                        "deviceType": "ANDROID",
                        "mobileOperatingSystem": "android",
                        "osVersion": "2.3.5",
                        "platform": "ANDROID"
                    }
                ],
                "googleKey": "9876"
            }
        ],
        "simplePushVariants": [],
        "iosvariants": []
    },
    {
        "id": "4028818b3fe37e75013fe38200200000",
        "name": "Cool App 1",
        "description": "A Cool App for testing",
        "pushApplicationID": "a1e09fed-b04f-4588-a9c1-b94df0e49bf7",
        "masterSecret": "3ababa8f-cc35-455b-8fc1-311ffe206538",
        "developer": "admin",
        "androidVariants": [
            {
                "id": "4028818b3fe37e75013fe3828bfc0001",
                "name": "Android Version",
                "description": "An Android Variant",
                "variantID": "12345",
                "secret": "12345",
                "developer": "admin",
                "installations": [
                    {
                        "id": "4028818b3fe37e75013fe38a65ae0002",
                        "deviceToken": "1234",
                        "deviceType": "ANDROID",
                        "mobileOperatingSystem": "android",
                        "osVersion": "2.3.5",
                        "platform": "ANDROID"
                    }
                ],
                "googleKey": "9876"
            }
        ],
        "simplePushVariants": [],
        "iosvariants": []
    }
];

var users = [
    {"id": "702beac3-1950-4eba-8b00-75207c9c6f10", "attributes": [], "enabled": true, "createdDate": 1378996266307, "expirationDate": null, "partition": {"id": "d0820a0f-8f43-481a-9ab8-88efd3d2150d", "attributes": [], "name": "default", "attributesMap": {}}, "loginName": "developer", "firstName": null, "lastName": null, "email": null, "attributesMap": {}},
    {"id": "3d188cd2-cd95-4042-bd7f-41807e3cd687", "attributes": [], "enabled": true, "createdDate": 1378996266388, "expirationDate": null, "partition": {"id": "d0820a0f-8f43-481a-9ab8-88efd3d2150d", "attributes": [], "name": "default", "attributesMap": {}}, "loginName": "admin", "firstName": null, "lastName": null, "email": null, "attributesMap": {}}
];


$.mockjax( {
    url: App.baseURL + "rest/auth/login",
    type: "POST",
    dataType: 'json',
    response: function ( arguments ) {
        var password = JSON.parse( arguments.data ).password;

        if ( password === "123" ) {
            this.status = 403;
        } else if ( password === "1234" ) {
            this.status = 204;
        } else {
            this.status = 401;
        }
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/auth/update",
    type: "PUT",
    status: 204,
    dataType: 'json'
} );

$.mockjax( {
    url: App.baseURL + "rest/applications",
    type: "GET",
    dataType: 'json',
    response: function ( arguments ) {
        this.responseText = apps;
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/users",
    type: "GET",
    dataType: 'json',
    response: function ( arguments ) {
        this.responseText = users;
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/users",
    type: "POST",
    dataType: 'json',
    response: function ( arguments ) {

        users.push( users[0] );
        this.responseText = apps;
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/applications/12345",
    type: "GET",
    dataType: 'json',
    response: function ( arguments ) {
        this.responseText = apps[ 0 ];
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/applications",
    type: "POST",
    dataType: 'json',
    response: function ( arguments ) {

        apps.push( apps[0] );
        this.responseText = apps;
    }
} );

$.mockjax( {
    url: App.baseURL + "rest/applications/12345",
    type: "PUT",
    dataType: 'json',
    response: function ( arguments ) {
        var data = JSON.parse( arguments.data ),
            name = data.name,
            description = data.description;

        apps[ 0 ].name = name;
        apps[ 0 ].description = description;

        this.responseText = apps[ 0 ];
    }
} );

$.mockjaxSettings.logging = false;
$.mockjaxSettings.responseTime = 0;
