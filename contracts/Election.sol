pragma solidity >=0.4.22 <0.8.0;

contract Election {

    struct Nominee {
      uint id;
      uint voteCount;
      string name;
    }
    string public candidate;

    mapping(uint => Nominee) public totalNominees;

//we need a way to store account that already voted so they wont vote again
    mapping(address=>bool)public alreadyVoted;//default is false
    uint public totalNomineesCount;
    string nominee1="Tom";
    string nominee2="Mishael";

    // Constructor will add two nominees the take part in the election
    constructor () public {
      addNominee(nominee1);
      addNominee(nominee2);
    }

    function addNominee(string storage _name) private{
      totalNomineesCount++;//increment number of nominees count so count=nomineeId
      totalNominees[totalNomineesCount]= Nominee(totalNomineesCount,0,_name);
      //creates the new nominee with the incremented id,_name and 0 as number of votes
    }

    function vote (uint _nomineeId) public{
      //make sure they never voted before

      require(!alreadyVoted[msg.sender]);//if the address never voted it will return a false. the "!" will change it to true.
      //we require that the specific address never voted so a true will give us just that

      require(_nomineeId>0&&_nomineeId<=totalNomineesCount);  //make sure that that voting could only be dont to a valid nominee1


      //once voted.. cant vote again- means one vote per address. so we will chnage the value of the mapping to true.
      alreadyVoted[msg.sender]=true;
      //we will increase nominee votes by 1
      totalNominees[_nomineeId].voteCount++;



    }
}
