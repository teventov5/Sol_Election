var ElectionTest=artifacts.require("./Election.sol");

contract ("Election",function(accounts){

  it("Init with only two nominees",function(){
    return ElectionTest.deployed().then(function(instance){
      return instance.totalNomineesCount();
    }).then(function(count){
      assert.equal(count,2);
    });
  });
});
