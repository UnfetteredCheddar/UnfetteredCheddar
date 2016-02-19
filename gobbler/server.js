//Public routes:
exposed = FlowRouter.group({
  prefix:'/front'
});

exposed.route('/', {
  name:'front',
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'main', footer: 'footer'});
  }
})

//Logged-in routes:
loggedIn = FlowRouter.group({
  triggersEnter: [ function () {
    if(!Meteor.userId()) {
      route = FlowRouter.current();
      if(route.route.name != 'front') {
       Session.set('redirectAfterLogin', route.path);
      }
      FlowRouter.go('front');
    }
  }]
})


loggedIn.route('/', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'main', footer: 'footer'});
  }
});

loggedIn.route('/userSettings', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'userSettings', footer: 'footer'});
  }
});

loggedIn.route('/notifications', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'notificationsView', footer: 'footer'});
  }
});
