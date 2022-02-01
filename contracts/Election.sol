pragma solidity >=0.4.22 <0.8.0;

contract Election {

    struct Nominee {
      uint id;
      uint voteCount;
      string name;
    }
    string public candidate;

    mapping(uint => Nominee) public totalNominees;
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
}
