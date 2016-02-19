//Public routes:
exposed = FlowRouter.group({
  prefix:'/front'
});

exposed.route('/', {
  name:'front',
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'welcome', footer: 'footer'});
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
  name: 'home',
  action: function () {
    console.log('arrived at home!');
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

//Handle log in and log out
// Accounts.onLogin(function () {
//   var redirect = Session.get('redirectAfterLogin');
//   if(redirect && redirect !== '/front') {
//     FlowRouter.go(redirect);
//   } else {
//     FlowRouter.go('home');
//   }
// });

// var started = false;
// Deps.autorun(function () {
//   if (started && !Meteor.userId()) {
//     console.log('I logged out!');
//     Meteor.logout(function () {
//     FlowRouter.go('front');
//     });
//   }
//   started = true;
// });


