//Public routes:
exposed = FlowRouter.group({
  prefix:'/welcome'
});

exposed.route('/', {
  name:'welcome',
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'welcome', footer: 'footer'});
  }
})

//Logged-in routes:
loggedIn = FlowRouter.group({
  triggersEnter: [ function () {
    if(!Meteor.userId()) {
      route = FlowRouter.current();
      if(route.route.name != 'welcome') {
       Session.set('redirectAfterLogin', route.path);
      }
      FlowRouter.go('welcome');
    }
  }]
})

loggedIn.route('/', {
  name: 'dashboard',
  action: function () {
    console.log('arrived at dashboard!');
    BlazeLayout.render('app_body', {header: 'headerTemplate', main: 'dashboardTemplate', footer: 'footerTemplate'});
  }
});

loggedIn.route('/userSettings', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'headerTemplate', main: 'userSettingsTemplate', footer: 'footerTemplate'});
  }
});

loggedIn.route('/notifications', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'headerTemplate', main: 'notificationsTemplate', footer: 'footerTemplate'});
  }
});

//Handle log in and log out
// Accounts.onLogin(function () {
//   var redirect = Session.get('redirectAfterLogin');
//   if(redirect && redirect !== '/welcome') {
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
//     FlowRouter.go('welcome');
//     });
//   }
//   started = true;
// });


