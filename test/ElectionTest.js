var ElectionContract=artifacts.require("./Election.sol");

contract ("Election",function(accounts){

  it("assertion there are only two nominees",function(){
    return ElectionContract.deployed().then(function(instance){
      return instance.totalNomineesCount();
    }).then(function(count){
      assert.equal(count,2);
    });
  });


  it("assertion nominee has correct values", function(){
    return ElectionContract.deployed().then(function(instance){
      electionInstance=instance;
      return electionInstance.totalNominees(1);
    }).then(function(nominee1){
      assert.equal(nominee1[0],1, "has the correct ID");
      assert.equal(nominee1[1],0, "has the correct voteCount");
      assert.equal(nominee1[2],"Tom", "has the correct name");

      return electionInstance.totalNominees(2);
    }).then(function(nominee2){
      assert.equal(nominee2[0],2, "has the correct ID");
      assert.equal(nominee2[1],0, "has the correct voteCount");
      assert.equal(nominee2[2],"Mishael", "has the correct name");

    });
  });


  it("assertion that a nominee can vote", function(){
    return ElectionContract.deployed().then(function(instance){
      electionInstance=instance;//instantiating the contract
      testNomineeId=1;//gonna vote for nominee number 1
      return electionInstance.vote(testNomineeId, {from: accounts[0]});//from the first address
    }).then(function(recipt){//save the recipt after the vote
      return electionInstance.alreadyVoted(accounts[0]);//get the voter status from the stored mapping
    }).then(function(voted){//store it in a boolean variable named voted
      assert(voted, "the voter was marked as voted");//assertion that voted==true
      return electionInstance.totalNominees(testNomineeId);//get the nominee with the proper id from mapping
    }).then(function(nominee){//store it in a variable called nominee
      var voteCount=nominee[1];
      assert.equal(voteCount,1,"increment the nominee's vote count");//make sure that the vote count of nominee==1
    })
  });




  it("asertion that app throws an exception for invalid nominees", function() {
    return ElectionContract.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(55, { from: accounts[1] })//try to vote for nominee with id=55(invalid id)
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");//assert it returned an error
      return electionInstance.totalNominees(1);//make sure that the state of contract is unaltered
    }).then(function(testNominee1) {//get the first nominee
      var voteCount = testNominee1[1];
      assert.equal(voteCount, 1, "nominee 1 did not receive any votes"); //make sure that nominee1 vote count is still 1(we already voted in test 3)
      return electionInstance.totalNominees(2);//get the second nominee
    }).then(function(testNominee2) {
      var voteCount = testNominee2[1];//make sure that nominee2 voteCount is still 0 (no vote were made for him in prev tests)
      assert.equal(voteCount, 0, "nominee 2 did not receive any votes");
    });
  });

  it("assertion that app throws an exception for voting more than once", function() {
    return ElectionContract.deployed().then(function(instance) {
      electionInstance = instance;
      testNomineeId = 2;
      electionInstance.vote(testNomineeId, { from: accounts[1] });//account[1] will now try to vote for a valid nominee(id=2) for the first time
      return electionInstance.totalNominees(testNomineeId);//get the nominee with id==2
    }).then(function(testNominee) {
      var voteCount = testNominee[1];

      //make sure that the first vote goes smoothly.
      //a timer wa added because it took my laptop some time to proccess the first vote
      setTimeout(() => {  assert.equal(voteCount, 1, "accepts first vote"); }, 2000);

      // Try to vote again
      return electionInstance.vote(testNomineeId, { from: accounts[1] });//account[1] will now try to vote for a valid nominee(id=2) twice
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");//assert it returned an error
      return electionInstance.totalNominees(1);
    }).then(function(testNominee1) {
      var voteCount = testNominee1[1];
      assert.equal(voteCount, 1, "nominee 1 did not receive any votes");//make sure that nominee1 vote count is still 1(we already voted in test 3)
      return electionInstance.totalNominees(2);
    }).then(function(testNominee2) {
      var voteCount = testNominee2[1];
      assert.equal(voteCount, 1, "nominee 2 did not receive any votes");//make sure that nominee2 vote count is still 1(we already voted in this test)
    });
  });







});
