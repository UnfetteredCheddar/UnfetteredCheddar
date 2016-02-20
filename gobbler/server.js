if (Meteor.isServer) {
  Meteor.publish('giblets', function(){
    var currentUser = this.userId;
    return Giblets.find(/*{ createdBy: currentUser }*/);
  });
}