var apps = [
    {
        "id": "402881893f62a12c013f631dc6cd0000",
        "name": "Application 1",
        "description": "Application 1 Description",
        "pushApplicationID": "8a0cf1df-0bcc-4a75-8b2a-78dff2915038",
        "masterSecret": "a04f822c-2224-45d9-a203-297e37c26c93",
        "developer": "admin",
        "androidApps": [{
            "id": "402881893f62a12c013f66f676c80001",
            "name": "Application1Android",
            "description": "An Android Variant of the Mobile App",
            "variantID": "32cede3c-27df-4eac-b807-65c31fbfeabc",
            "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
            "developer": "admin",
            "instances": [],
            "googleKey": "1234567890"
        },{
            "id": "402881893f62a12c013f66f676c80001",
            "name": "Application2Android",
            "description": "A Free Android version of the app",
            "variantID": "32cede3c-27df-4eac-b807-65c31fbfeabc",
            "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
            "developer": "admin",
            "instances": [],
            "googleKey": "1234567890"
        }],
        "simplePushApps": [{
            "id": "402881893f62a12c013f66f676c80001",
            "name": "Simple Push application",
            "description": "A Simple Push Variant of the Mobile App",
            "variantID": "32cede3c-27df-4eac-b807-65c31fbfeabc",
            "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
            "developer": "admin",
            "instances": [],
            "pushNetworkURL": "thing"
        }],
        "iosapps": [{
            "id": "402881893f62a12c013f66f676c80001",
            "name": "iOS application",
            "description": "An iOS Variant of the Mobile App",
            "variantID": "32cede3c-27df-4eac-b807-65c31fbfeabc",
            "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
            "developer": "admin",
            "instances": []
        }]
    },
    {
        "id": "402881893f62a12c013f631dc6cd0001",
        "name": "Application 2",
        "description": "Application 2 Description",
        "pushApplicationID": "2a0cf1df-0bcc-4a75-8b2a-78dff2915038",
        "masterSecret": "a04f822c-2224-45d9-a203-297e37c26c93",
        "developer": "admin",
        "androidApps": [{
            "id": "102881893f62a12c013f66f676c80001",
            "name": "Application1Android",
            "description": "An Android Variant of the Mobile App",
            "variantID": "12cede3c-27df-4eac-b807-65c31fbfeabc",
            "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
            "developer": "admin",
            "instances": [],
            "googleKey": "12345678901"
        }],
        "simplePushApps": [],
        "iosapps": []
    }
];

var baseURL = "/ag-push/rest/";

$.mockjax({
    type: "GET",
    url: baseURL + "applications",
    responseTime: 750,
    dataType: "json",
    response: function() {
        this.responseText = apps;
    }
});

 /*url: /^\/auctions\/([\d\-]+)$/,
    urlParams: [ "itemId" ],
    contentType: "text/json",
    response: function( settings ) {
        this.responseText = items[ settings.urlParams.itemId ];
    }*/

$.mockjax({
    type: "GET",
    url: baseURL + "applications/8a0cf1df-0bcc-4a75-8b2a-78dff2915038",
    responseTime: 750,
    dataType: "json",
    response: function() {
        this.responseText = apps[0];
    }
});


$.mockjax({
    type: "GET",
    url: baseURL + "applications/8a0cf1df-0bcc-4a75-8b2a-78dff2915038/32cede3c-27df-4eac-b807-65c31fbfeabc",
    responseTime: 750,
    dataType: "json",
    response: function() {
        this.responseText = apps[0].androidApps[0];
    }
});

$.mockjax({
    type: "DELETE",
    url: baseURL + "applications/8a0cf1df-0bcc-4a75-8b2a-78dff2915038",
    responseTime: 750,
    dataType: "json",
    response: function() {
        this.responseText = apps[0];
    }
});


$.mockjax({
    type: "POST",
    url: baseURL + "applications",
    responseTime: 750,
    dataType: "json",
    response: function() {
        apps.push( {
            "id": "402881893f62a12c013f631dc6cd0000",
            "name": "Application 1",
            "description": "Application 1 Description",
            "pushApplicationID": "8a0cf1df-0bcc-4a75-8b2a-78dff2915038",
            "masterSecret": "a04f822c-2224-45d9-a203-297e37c26c93",
            "developer": "admin",
            "androidApps": [{
                "id": "402881893f62a12c013f66f676c80001",
                "name": "Application1Android",
                "description": "An Android Variant of the Mobile App",
                "variantID": "32cede3c-27df-4eac-b807-65c31fbfeabc",
                "secret": "66063664-4a87-4b02-8c0b-1d2b0cec0726",
                "developer": "admin",
                "instances": [],
                "googleKey": "1234567890"
            }],
            "simplePushApps": [],
            "iosapps": []
        });
        this.responseText = apps;
    }
});

