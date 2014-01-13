App.UserIndexController = Ember.ArrayController.extend( {
    showLink: false,
    needs: ["application","login","userIndex"],
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
            var that = this,
                role = $( "input[name=role]:checked" ).val();

            App.AeroGear.authenticator.enroll( JSON.stringify( { loginName: controller.get("loginName"), role: role} ), {
                contentType: "application/json",
                success: function ( data ) {
                    Ember.run( this, function () {
                        $( "form" )[0].reset();
                        that.set( "error", "" );
                        var content = that.get( "model" ).get( "content" );
                        content.pushObject( data );
                        that.get( "model" ).set("unregisteredUser",data);

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
        reset: function ( user ) {
            var that = this,
            resetPipe = AeroGear.Pipeline( {
                name: "initreset",
                settings: {
                    endpoint: "rest/initreset"
                }
            } ).pipes.reset;

            resetPipe.save( user, {
                success: function (data) {
                    var content = that.get( "model" ).get( "content" );
                    content.pushObject( data );
                    that.get( "model" ).set("unregisteredUser",data);

                },
                error: function ( error ) {
                    console.log( "error with resetting user", error );
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
            that.send("toggleLinkOverlay");
        },
        confirm: function ( controller ) {
            var user = controller.get( "model" );
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

            user.validateProperty( "password" );
            user.validateProperty( "confirmPassword" );

            if(token && user.get( "isValid" )) {

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
                                self.location =  "index.html";
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            console.log( textStatus );
                            console.log( errorThrown );
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
