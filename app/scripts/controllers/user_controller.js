App.UserController = Ember.ArrayController.extend({
  remove: function( user ) {
    var things = user,
        that = this,
        userPipe =  AeroGear.Pipeline({
          name: "users",
          settings: {
            authenticator: App.AeroGear.authenticator,
            baseURL: App.baseURL + "rest/"
          }
        }).pipes.users;

    userPipe.remove( user.id, {
      success: function() {
        var content = that.get("model").get("content"),
            find;

        find = content.find( function( value ) {
          return value.id === things.id;
        });

        content.removeObject( find );
      },
      error: function( error ) { // TODO: Maybe Make this a class method?
        console.log( "error with deleting user", error );
        switch( error.status ) {
          case 401:
            App.Router.router.transitionToRoute("login");
            break;
          default:
            //that.transitionToRoute( "login" );
            //result.setProperties( { isLoaded: true, error: error } );
            break;
        }
      }
    });
  },

  enroll: function() {
    var that = this;
    App.AeroGear.authenticator.enroll( JSON.stringify( { loginName: this.loginName, password: this.password } ), {
      contentType: "application/json",
      success: function() {
        Ember.run( this, function() {
          $( "form" )[0].reset();
          that.set( "error", "" );
          var content = that.get( "model" ).get( "content" );
          content.find();
          that.transitionToRoute( "user" );
        });

      },
      error: function( error ) {
        //TODO: Show errors on screen
        console.log( "Error enrolling in", error );
        that.set( "error", "enrolling Error" );
      }
    });

  }

});
