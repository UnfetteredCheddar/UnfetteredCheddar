// gibletData = [
// {
//   taskname: 'Find tandem bike',
//   url: 'https://sfbay.craigslist.org/search/bik',
//   keywords: 'tandem',
//   SMS: true,
//   email: true,
//   frequency: '1'
// },
// {
//   taskname: 'Find Fender',
//   url: 'https://www.reddit.com/r/Guitar/',
//   keywords: 'Fender',
//   SMS: false,
//   email: false,
//   frequency: '1'
// },
// {
//   taskname: 'Find job',
//   url: 'http://www.indeed.com/jobs?q=engineer&l=San+Francisco%2C+CA',
//   keywords: 'javascript, front-end',
//   SMS: true,
//   email: false,
//   frequency: '1'
// }];


var expect = chai.expect;
var assert = chai.assert;

// if (!(typeof MochaWeb === 'undefined')){
//   MochaWeb.testOnly(function(){
//     describe("Giblet Methods", function(){

//       before(function(done) {
//         // Meteor.call('clearGibletsDB');
//         var gibletCount = [1,2,3];
//         gibletCount.forEach(function(giblet) {
//           console.log(giblet);
//           Meteor.call('addGiblet');
//         });
//         done();
//       });

//       beforeEach(function(done) {
//         console.log('before each');
//         done();
//       });

//       after(function() {
//         Meteor.call('clearGibletsDB');
//         console.log('Meteor call after!!');
//       });

//       it('should be able to fetch Giblets from collection', function() {
//         var giblets = Giblets.find().fetch();

//         console.log('Test 1==============', giblets, giblets.length);

//         expect(giblets).to.be.a('array');
//         expect(giblets).to.have.length(3);
//       });

      // it('should add new Giblet when addGiblet method is invoked', function(){
      //   Meteor.call('addGiblet', {
      //     taskname: 'Pass test',
      //     url: 'http://www.test.com/',
      //     keywords: 'pass, testing',
      //     SMS: false,
      //     email: false,
      //     frequency: '1'
      //   });
      //   var giblets = Giblets.find().fetch();
      //   var newGib = Giblets.find({taskname:'Pass test'}).fetch();
      //   assert.equal(giblets.length, 4);
      //   expect(newGib).to.have.length(1);
      // });

  //     it('should update a Giblet by using the updateGiblet method', function(){
  //       var obj = {
  //         taskname: 'Pass test',
  //         url: 'http://www.test.com/',
  //         keywords: 'pass, testing',
  //         SMS: false,
  //         email: false,
  //         frequency: '1'
  //       };

  //       var id = Giblets.insert(obj);
  //       Meteor.call('updateGiblet', id, {taskname:'Updated test'});
  //       var newGib = Giblets.find({taskname:'Updated test'}).fetch();
  //       expect(newGib).to.have.length(1);
  //     });

  //     it('should delete a Giblet by using the deleteGiblet method', function(){
  //       var obj = {
  //         taskname: 'Pass test',
  //         url: 'http://www.test.com/',
  //         keywords: 'pass, testing',
  //         SMS: false,
  //         email: false,
  //         frequency: '1'
  //       };

  //       var id = Giblets.insert(obj);
  //       Meteor.call('removeGiblet', id);
  //       var newGib = Giblets.find({taskname:'Pass test'}).fetch();
  //       var giblets = Giblets.find().fetch();
  //       // TODO solve the length issue for the test
  //       // Also do comparison before and after delete
  //       assert.equal(giblets.length, 3);
  //       expect(newGib).to.have.length(0);
  //     });

  //     it('should empty the collection of giblets', function(){
  //       Meteor.call('clearGibletsDB');
  //       var giblets = Giblets.find().fetch();
  //       expect(giblets).to.have.length(0);
  //     });

  //     xit('should only display Giblets for current user', function() {
  //       var currentUser = Meteor.userId();
  //       Giblets.insert({
  //         createdAt: new Date(),
  //         owner: 'Something else',
  //         taskname: 'Should not be visible',
  //         url: 'http://www.noThanks.com',
  //         keywords: 'bad, not permissioned',
  //         SMS: true,
  //         email: false,
  //         frequency: 4,
  //         active: true
  //       });
  //       var badGib = Giblets.find({taskname:'Should not be visible'}).fetch();
  //       expect(badGib).to.have.length(0);
  //     });
//     });
//   });
// }



// if (!(typeof MochaWeb === 'undefined')){
//   MochaWeb.testOnly(function(){
//     var selectGraceHopper = function(){
//       Session.set("selected_player", Players.findOne({name: "Grace Hopper"})._id);
//     };

//     var unselectPlayer = function(){
//       Session.set("selected_player", null);
//       Meteor.flush();
//     }

//     describe("Select Grace Hopper", function(){
//       before(function(done){
//         Meteor.autorun(function(){
//           var grace = Players.findOne({name: "Grace Hopper"});
//           if (grace){
//             selectGraceHopper();
//             done();
//           }
//         })
//       });

//       it("should show Grace the inside div class='name' (above the give points button)", function(){
//         Meteor.flush();
//         chai.assert.equal($("div.details > div.name").html(), "Grace Hopper");
//       });
//     });

//     describe("Point Assignment", function(){
//       before(function(){
//         selectGraceHopper();
//       });

//       it("should give a player 5 points when they are selected and the button is pressed", function(){
//         var graceInitialPoints = Players.findOne({name: "Grace Hopper"}).score;
//         $("input:button").click();
//         chai.assert.equal(graceInitialPoints + 5, Players.findOne({name: "Grace Hopper"}).score);
//       });
//     });
//   });
