var expect = chai.expect;
var assert = chai.assert;
var oldGiblets, oldLength, gibletData;

if (!(typeof MochaWeb === 'undefined')){
  MochaWeb.testOnly(function(){
    describe("Giblet Methods", function(){
      before(function(done) {
        oldGiblets = Giblets.find().fetch();
        oldLength = oldGiblets.length;
        gibletData = {
          taskname: 'Find tandem bike',
          url: 'https://sfbay.craigslist.org/search/bik',
          keywords: 'tandem',
          SMS: true,
          email: true,
          frequency: '1'
        };
        done();
      });
      it('should be able to fetch Giblets from collection', function() {
        console.log(gibletData);
        expect(oldGiblets).to.exist;
      });
      it('should add new Giblet when addGiblet is called', function(){
        Meteor.call('addGiblet', gibletData);
        var newLength = Giblets.find().fetch().length;
        assert.equal(newLength, oldLength + 1);
      });

    });
  });
}



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
// }