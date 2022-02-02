App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },


  listenForEvents: function(){
    App.contracts.Election.deployed().then(function(instance){

      instance.votingEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error,event){
        console.log("event triggered", event)
        // App.render(); // for some reason the auto refresh causes multiple rows of the same nominees.
      });
    });
  },




  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    if(window.ethereum){
        ethereum.enable().then(function(acc){
            App.account = acc[0];
            $("#accountAddress").html("Your Account: " + App.account);
        });
    }

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.totalNomineesCount();
    }).then(function(nomineesCount) {
      var nomineesResult = $("#nomineesResult");
      nomineesResult.empty();

      var nomineesSelect = $('#nomineesSelect');
      nomineesSelect.empty();

      for (var i = 1; i <= nomineesCount; i++) {
        electionInstance.totalNominees(i).then(function(nominee) {
          var id = nominee[0];
          var voteCount = nominee[1];
          var name = nominee[2];


          // Render nominee Result
          var nomineeTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
          nomineesResult.append(nomineeTemplate);

          var nomineeOption = "<option value='" + id + "' >" + name + "</ option>"
          nomineesSelect.append(nomineeOption)

        });
      }
      return electionInstance.alreadyVoted(App.account);
    }).then(function(hasVoted){
      if(hasVoted){
        $('form').hide();
      }
      loader.hide();
      content.show();

    }).catch(function(error) {
      console.warn(error);
    });
  },

  castVote: function(){
    var nomineeId = $('#nomineesSelect').val();
    App.contracts.Election.deployed().then(function(instance){
      return instance.vote(nomineeId, {from: App.account});
    }).then(function(result){

      $("#content").hide();
      $("#loader").show();
    }).catch(function(err){
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });



});
