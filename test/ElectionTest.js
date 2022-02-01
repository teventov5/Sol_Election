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







});
