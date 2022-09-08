//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "solidity-string-utils/StringUtils.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;
    //The fee charged by the marketplace to be allowed to list an NFT
    uint256 listPrice = 0.01 ether;


    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool readyForListing;
        string identifier;
        string ipfsURI;
        string additionalDetails;
        VerificationInfo currentVerificationStatus;
        uint256 timeOfCreation;
    }

    struct VerificationInfo {
        string verified;
        string status;
        address expertAddress;
        string fileURI;
        uint256 time;
        string details;
    }

    struct OwnerChange {
        address prevOwner;
        address currentOwner;
        uint256 timeVal;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address owner,
        address seller,
        uint256 price,
        bool readyForListing    
    );

    event TokenVerified (
        uint256 indexed tokenId,
        string identifier,
        string uri,
        string status,
        uint256 time,
        address expertAddress,
        string details,
        string verified  
    );

     event CollectionCreated (
        uint256 indexed tokenId,
        string identifier,
        string uri,
        string verified,
        string status,
        string additionalDetails
    );
//TokenCreated(tokenId, price, _time, _status, _details, _expertAddress, _ipfsUri);
     event TokenCreated (
        uint256 indexed tokenId,
        string identifier,
        uint256 price,
        uint256 time,
        string status,
        string details,
        address expertAddress,
        string uri,
        string _additionalDetails
    );

    // get the token
    mapping(uint256 => ListedToken) private idToListedToken;

    // get all the experts who verified a token
    mapping(uint256 => address[]) private idToVerifiedBy;

    // get all tokens verified by a specific expert
    mapping(address => uint256[]) private addressToTokensVerified;

    // get the verification timeline of a specific token
    mapping(uint256 => VerificationInfo[]) private tokenIDToVerificationHistory;

    // get the tokenId from the identifier
    mapping(string => uint256) private identifierToTokenID;

    // get the identifier from the tokenId
    mapping(uint256 => string) private tokenIDToIdentifier;

    // get the owner history of a token
    mapping(uint256 => OwnerChange[]) private owners;

    // get the ipfsuri of a token
    mapping(uint256 => string) private tokenIdToIpfsUri;

    // get who intially verified the token
    mapping(uint256 => address) private idToInitialVerifier;

    // get time of verification
    mapping(uint256 => uint256) private idToTimeVerified;

    // get verification details
    mapping(uint256 => string) private idToVerificationDetails;

    // get status 
    mapping(uint256 => string) private idToStatus;

    mapping(uint256 => string) private tokenIDToAdditionalDetails;

    mapping(string => uint256) private additionalDetailsToTokenId;


    constructor() ERC721("MUSK", "MSK") {
        owner = payable(msg.sender);
    }

    function updateListPrice(uint256 _listPrice) public payable {
        require(owner == msg.sender, "Only owner can update listing price");
        listPrice = _listPrice;
    }

    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getLatestIdToListedToken() public view returns (ListedToken memory) {
        uint256 currentTokenId = _tokenIds.current();
        return idToListedToken[currentTokenId];
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getListedTokenWithIdentifier(string memory _identifier) public view returns (ListedToken memory) {
        uint256 tokenId = identifierToTokenID[_identifier];
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }


    function createCollection(string memory _ipfsURI, string memory _identifier, uint256 _timeOfCreation, string memory _additionalDetails) public returns(string memory){
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        identifierToTokenID[_identifier] = newTokenId;
        tokenIDToIdentifier[newTokenId] = _identifier;

        tokenIDToAdditionalDetails[newTokenId] = _additionalDetails;
        additionalDetailsToTokenId[_additionalDetails] = newTokenId ;

        tokenIdToIpfsUri[newTokenId] = _ipfsURI;

        //Create the mapping of tokenId's to Token details
        idToListedToken[newTokenId] = ListedToken({
            tokenId: newTokenId, 
            owner: payable(address(0)),
            seller: payable(address(0)),
            price:0,
            readyForListing: false,
            identifier: _identifier, 
            ipfsURI: _ipfsURI,
            additionalDetails: _additionalDetails,
            currentVerificationStatus: VerificationInfo({
                verified: 'No', 
                status:'pending',
                expertAddress: payable(address(0)),
                fileURI: '',
                time: 0,
                details: ''
                }),
            timeOfCreation: _timeOfCreation 
            });

        tokenIDToVerificationHistory[newTokenId].push(VerificationInfo({
                verified: 'No', 
                status:'pending',
                expertAddress: payable(address(0)),
                fileURI: '',
                time:0,
                details: ''
                }));

        emit CollectionCreated(newTokenId, _identifier, _ipfsURI, 'No','pending',_additionalDetails);

        return _identifier;
        
    }

    //The first time a token is created, it is listed here
    function createToken(string memory tokenURI, uint256 price, string memory _identifier, uint256 _time) public payable returns (uint) {
       
        uint256 tokenId = identifierToTokenID[_identifier];
        
        string memory _status = idToStatus[tokenId];

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, tokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(tokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        createListedToken(tokenId, price, _time, _status);
 
        return tokenId;
    }

    function createListedToken(uint256 tokenId, uint256 price, uint256 _time, string memory _status) private {
        string memory _identifier = tokenIDToIdentifier[tokenId];
        string memory _additionalDetails = tokenIDToAdditionalDetails[tokenId];
        //Make sure the sender sent enough ETH to pay for listing
       // require(msg.value == listPrice, "Hopefully sending the correct price");
        require(price > 0, "Make sure the price isn't negative");

        address _expertAddress = idToInitialVerifier[tokenId];
        string memory _ipfsUri = tokenIdToIpfsUri[tokenId];
        uint256 _timeVerified = idToTimeVerified[tokenId];
        string memory _details = idToVerificationDetails[tokenId];

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken({
            tokenId: tokenId,
            identifier: _identifier,
            owner: payable(address(this)),
            seller: payable(msg.sender),
            price: price,
            readyForListing: true,
            timeOfCreation: _time,
            ipfsURI: _ipfsUri,
            additionalDetails: _additionalDetails,
            currentVerificationStatus: VerificationInfo({
                verified: 'Yes', 
                status: _status,
                expertAddress : _expertAddress,
                fileURI: _ipfsUri,
                time: _timeVerified,
                details: _details
                })
            });

        tokenIDToVerificationHistory[tokenId].push(VerificationInfo({
                verified: 'Yes', 
                status: _status,
                expertAddress : _expertAddress,
                fileURI: _ipfsUri ,
                time: _timeVerified,
                details: _details
                }));

        owners[tokenId].push(OwnerChange({
            currentOwner: msg.sender, 
            prevOwner: payable(address(0)), 
            timeVal: _time
            }));

        _transfer(msg.sender, address(this), tokenId);

       emit TokenCreated(tokenId, _identifier,price, _time, _status, _details, _expertAddress, _ipfsUri,_additionalDetails);
    }
    
    //This will return all the NFTs currently listed to be sold on the marketplace
    function getAllNFTs() public view returns (ListedToken[] memory) {
        uint nftCount = _tokenIds.current();
        ListedToken[] memory tokens = new ListedToken[](nftCount);
        uint currentIndex = 0;

        //at the moment currentlyListed is true for all, if it becomes false in the future we will 
        //filter out currentlyListed == false over here
        for(uint i=
        0;i<nftCount;i++)
        {
            uint currentId = i + 1;
            ListedToken storage currentItem = idToListedToken[currentId];
            tokens[currentIndex] = currentItem;
            currentIndex += 1;
        }
        //the array 'tokens' has the list of all NFTs in the marketplace
        return tokens;
    }
    
    //Returns all the NFTs that the current user is owner or seller in
    function getMyNFTs() public view returns (ListedToken[] memory) {
        uint totalItemCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;
        
        //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        for(uint i=0; i < totalItemCount; i++)
        {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
                itemCount += 1;
            }
        }

        //Once you have the count of relevant NFTs, create an array then store all the NFTs in it
        ListedToken[] memory items = new ListedToken[](itemCount);
        for(uint i=0; i < totalItemCount; i++) {
            if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender) {
                uint currentId = i+1;
                ListedToken storage currentItem = idToListedToken[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function executeSale(uint256 tokenId, uint256 _timeVal) public payable {
        uint price = idToListedToken[tokenId].price;
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        idToListedToken[tokenId].readyForListing = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        
            
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        _transfer(address(this), msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
        
        owners[tokenId].push(OwnerChange({
            prevOwner: seller,
            currentOwner: msg.sender,
            timeVal: _timeVal}));
    }

    // modifier onlyExpert(){
    //     require(addressToExpertAccount[msg.sender] == true);
    //     _;
    // }


    // we get the tokenId & theURI after the form is submitted in the response
    function verifyObject(string memory _details, string memory _verified, string memory _identifier, string memory theURI, string memory _status, uint256 _time) public returns (string memory) {
        //uint256 index = addressToTokensVerified[msg.sender].length;
        uint256 theTokenId = identifierToTokenID[_identifier];

        idToListedToken[theTokenId].currentVerificationStatus.verified = _verified;
        idToListedToken[theTokenId].currentVerificationStatus.status = _status;
        idToListedToken[theTokenId].currentVerificationStatus.expertAddress = msg.sender;
        idToListedToken[theTokenId].currentVerificationStatus.fileURI = theURI;


        tokenIDToVerificationHistory[theTokenId].push(VerificationInfo({
            verified: _verified, 
            status: _status,
            expertAddress: msg.sender,
            fileURI: theURI,
            time: _time,
            details: _details
        }));

        addressToTokensVerified[msg.sender].push(theTokenId);
        idToVerifiedBy[theTokenId].push(msg.sender);
        idToInitialVerifier[theTokenId] = msg.sender;
        idToTimeVerified[theTokenId] = _time;
        idToStatus[theTokenId] = _status;

        emit TokenVerified(theTokenId, _identifier, theURI, _status, _time, msg.sender, _details, _verified);

        return idToListedToken[theTokenId].currentVerificationStatus.verified;
    }

    function getVerifiedObjects() public view returns (ListedToken[] memory){
        uint256 numberVerified = addressToTokensVerified[msg.sender].length;
        ListedToken[] memory verifiedObjects = new ListedToken[](numberVerified);
        uint totalItemCount = _tokenIds.current();
        // uint itemCount = 0;
        
        // //Important to get a count of all the NFTs that belong to the user before we can make an array for them
        // for(uint i=0; i < totalItemCount; i++)
        // {
        //     if(idToListedToken[i+1].owner == msg.sender || idToListedToken[i+1].seller == msg.sender){
        //         itemCount += 1;
        //     }
        // }

        //We store the verified objects in an array
        for (uint i = 0; i <totalItemCount; i++ ){
         verifiedObjects[i] = idToListedToken[addressToTokensVerified[msg.sender][i]];
        }

        return verifiedObjects;
        
    }


    function returnVerificationInfo(uint256 _tokenId) public view returns (VerificationInfo[] memory){
       return tokenIDToVerificationHistory[_tokenId];
    }



}