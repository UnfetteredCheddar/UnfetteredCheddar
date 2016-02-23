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
    BlazeLayout.render('app_body', {header: 'header', main: 'dashboard', footer: 'footer'});
  }
});

loggedIn.route('/userSettings', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'userSettings', footer: 'footer'});
  }
});

loggedIn.route('/notifications', {
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'viewNotifications', footer: 'footer'});
  }
});

//default:
FlowRouter.notFound = {
  action: FlowRouter.go('dashboard')
};

//Handle log in and log out
Accounts.onLogin(function () {
  var redirect = Session.get('redirectAfterLogin');
  if(redirect && redirect !== '/welcome') {
    FlowRouter.go(redirect);
  } else {
    FlowRouter.go('dashboard');
  }
});

Meteor.methods({
  checkForUser: function () {
    console.log('%%%%% USER:', Meteor.userId());
    if(!Meteor.userId()) {
      FlowRouter.go('welcome');
    }
  }
});

Tracker.autorun(function () {
  Meteor.call('checkForUser');
});


