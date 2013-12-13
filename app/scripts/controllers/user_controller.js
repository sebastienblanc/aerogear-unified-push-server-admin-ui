App.UserIndexController = Ember.ArrayController.extend( {
    showLink: false,
    needs: "application",
    actions: {
        toggleLinkOverlay: function() {
            if ( this.get( "showLink" ) ) {
                this.set( "showLink", false );
            }
            else {
                this.set( "showLink", true );
            }
        },
        remove: function ( user ) {
            var things = user,
                that = this,
                userPipe = AeroGear.Pipeline( {
                    name: "users",
                    settings: {
                        authenticator: App.AeroGear.authenticator,
                        baseURL: App.baseURL + "rest/"
                    }
                } ).pipes.users;

            userPipe.remove( user.id, {
                success: function () {
                    var content = that.get( "model" ).get( "content" ),
                        find;

                    find = content.find( function ( value ) {
                        return value.id === things.id;
                    } );

                    content.removeObject( find );
                },
                error: function ( error ) { // TODO: Maybe Make this a class method?
                    console.log( "error with deleting user", error );
                    switch ( error.status ) {
                    case 401:
                        App.Router.router.transitionToRoute( "login" );
                        break;
                    default:
                        //that.transitionToRoute( "login" );
                        //result.setProperties( { isLoaded: true, error: error } );
                        break;
                    }
                }
            } );
        },

        enroll: function ( controller ) {
            var that = this;

            App.AeroGear.authenticator.enroll( JSON.stringify( { loginName: controller.get("loginName")} ), {
                contentType: "application/json",
                success: function ( data ) {
                    Ember.run( this, function () {
                        $( "form" )[0].reset();
                        that.set( "error", "" );
                        var content = that.get( "model" ).get( "content" );
                        content.pushObject( data );
                        that.get( "model" ).set("newUser",data);

                        //that.transitionToRoute( "user" );
                    } );

                },
                error: function ( error ) {
                    //TODO: Show errors on screen
                    console.log( "Error enrolling in", error );
                    that.set( "error", "enrolling Error" );
                }
            } );
            this.send("toggleLinkOverlay");
        },
        confirm: function ( controller ) {
            var that = this;
            //Props to lholmquist
            var parseQueryString = function( locationString ) {
                //taken from https://developers.google.com/accounts/docs/OAuth2Login
                // First, parse the query string
                var params = {},
                    queryString = locationString.substr( locationString.indexOf( "?" ) + 1 ),
                    regex = /([^&=]+)=([^&]*)/g,
                    m;
                while ( ( m = regex.exec(queryString) ) ) {
                    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
                }
                return params;
            };

            var token = parseQueryString( window.location.search ).id;

            if(token) {

                var updatePipeline = AeroGear.Pipeline([
                    {
                        name: "reset",
                        settings: {
                            endpoint: "rest/reset"
                        }
                    }
                ]).pipes.reset;
                updatePipeline.save({
                        token : token,
                        email: controller.get("loginName"),
                        password: controller.get("password"),
                        confirmation: controller.get("confirmPassword")
                    },
                    {
                        success: function() {
                            Ember.run( this, function() {
                                that.transitionToRoute( "mobileApps" );
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log( "Oh noes! " + textStatus );
                            console.log( "\n" + errorThrown );
                        }
                    });

            }
        }

    }
} );

App.UserAddController = Ember.ObjectController.extend( {
    needs: "userIndex"
});

App.UserEditController = Ember.ObjectController.extend( {
    needs: "userIndex"
});

App.UserUpdateController = Ember.ObjectController.extend( {
    needs: "userIndex"
});
