module('App.UserController', {
    setup: function() {
        App.reset();
        var controller = App.__container__.lookup("controller:user");
        this.controller = controller;
    },
    teardown: function() {
        //$.mockjaxClear();
    }
});

test( "users table rows", function() {
    var that = this;
    visit( "/user" ).then( function() {
        var rows = find("table tbody tr").length
        equal( rows, 2, "should be 2 rows in the table, instead " + rows );
    });
});

