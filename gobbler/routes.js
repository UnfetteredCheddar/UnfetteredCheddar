// Public routes:
exposed = FlowRouter.group({
  prefix:'/welcome'
});

exposed.route('/', {
  name:'welcome',
  action: function () {
    BlazeLayout.render('app_body', {header: 'header', main: 'welcome', footer: 'footer'});
  }
});

// Logged-in routes:
loggedIn = FlowRouter.group({
  triggersEnter: [ function () {
    if ( !Meteor.userId() ) {
      FlowRouter.go('welcome');
    }
  }]
});

loggedIn.route('/', {
  name: 'dashboard',
  action: function () {
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

// Default
FlowRouter.notFound = {
  action: FlowRouter.go('dashboard')
};

// Handle log in and log out
Accounts.onLogin(function () {
  FlowRouter.go('dashboard');
});

Meteor.methods({
  checkForUser: function () {
    if ( !Meteor.userId() ) {
      FlowRouter.go('welcome');
    }
  }
});

Tracker.autorun(function () {
  Meteor.call('checkForUser');
});
