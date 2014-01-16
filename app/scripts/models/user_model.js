/* JBoss, Home of Professional Open Source
* Copyright Red Hat, Inc., and individual contributors
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
* http://www.apache.org/licenses/LICENSE-2.0
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/*
    A User Object
*/

App.User = Ember.Object.extend( Ember.Validations, {
    loginNameChange: function() {
        App.__container__.lookup("controller:application" ).send("clearErrors");
        $( "#newUserLoginName" ).removeClass( "error" );
    }.observes('loginName'),
    validations: {
        loginName: {
            presence: true
        },
        password: {
            presence: true
        },
        confirmPassword: {
            presence: true,
            match: {
                property: "password"
            }
        }
    }
});

App.User.reopenClass( {
    find: function ( userID ) {
        var user,
            userPipe = AeroGear.Pipeline( {
                name: "users",
                settings: {
                    authenticator: App.AeroGear.authenticator,
                    baseURL: App.baseURL + "rest/"
                }
            } ).pipes.users,
            model = this;

        if ( userID ) {
            // Looking for 1
            user = App.user.create();
        } else {
            //Looking for all
            user = Ember.ArrayProxy.create( { content: [] } );
        }

        // Need to return a promise for "modelFor" to work.
        userPipe.read( {
            id: userID
        } )
            .then( function ( response ) {
                Ember.run( this, function () {
                    console.log( response );
                    if ( AeroGear.isArray( response ) ) {
                        response.forEach( function ( data ) {
                            data.isLoaded = true;
                            //data = model._createUserObject( data );
                            user.pushObject( App.User.create( data ) );
                        } );
                    } else {
                        // Add a loading indicator
                        response.isLoaded = true;
                        user.setProperties( model._createUserObject( response ) );
                        console.log( user );
                    }
                } );
            } )
            .then( null, function ( error ) {
                console.log( "error with user endpoint", error );
                switch ( error.status ) {
                case 401:
                    App.Router.router.transitionTo( "login" );
                    break;
                default:
                    //that.transitionToRoute( "login" );
                    //result.setProperties( { isLoaded: true, error: error } );
                    break;
                }
            } );

        return user;
    },
    _createUserObject: function ( response ) {

        Object.keys( response ).forEach( function ( data ) {
            if ( AeroGear.isArray( response[ data ] ) ) {
                var proxy = Ember.ArrayProxy.create( { content: [] } );

                response[ data ].forEach( function ( value ) {
                    value.loginName = response.loginName;
                    proxy.pushObject( App.User.create( value ) );
                } );

                response[ data ] = proxy;
            }
        } );

        return response;

    }
} );
