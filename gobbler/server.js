FlowRouter.route('/', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the index:");
    BlazeLayout.render('app_body', {header: 'header', main: 'main', footer: 'footer'});
  }
});

FlowRouter.route('/userSettings', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the index:");
    BlazeLayout.render('app_body', {header: 'header', main: 'userSettings', footer: 'footer'});
  }
});

FlowRouter.route('/notifications', {
  action: function(params, queryParams) {
    console.log("Yeah! We are on the index:");
    BlazeLayout.render('app_body', {header: 'header', main: 'notificationsView', footer: 'footer'});
  }
});