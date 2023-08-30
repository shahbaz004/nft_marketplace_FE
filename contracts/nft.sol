// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    Counters.Counter private _tokenIds;
    mapping(uint256 => address) private _creators;

    struct NFT {
        address creator;
        address owner;
        uint256 price;
        bool listed;
        bool isSold;
    }

    mapping(uint256 => NFT) private _nfts;
    mapping(address => uint256[]) private _soldNFTs;

    event TokenMinted(uint256 indexed tokenId, string tokenURI);
    event TokenListed(uint256 indexed tokenId, uint256 price, address seller);
    event TokenUnlisted(uint256 indexed tokenId);
    event TokenPurchased(uint256 indexed tokenId, address buyer, address seller);

    constructor() ERC721("MarkKop", "MARK") {}

    modifier onlyTokenOwner(uint256 tokenId) {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of the token");
        _;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _creators[newItemId] = msg.sender;
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        _nfts[newItemId] = NFT({
            creator: msg.sender,
            owner: msg.sender,
            price: 0,
            listed: false,
            isSold: false
        });

        emit TokenMinted(newItemId, tokenURI);
        return newItemId;
    }

    function listToken(uint256 tokenId, uint256 price) external onlyTokenOwner(tokenId) {
        require(!_nfts[tokenId].listed, "Token is already listed");
        require(price > 0, "Price must be greater than zero");

        _nfts[tokenId].price = price;
        _nfts[tokenId].listed = true;
        _nfts[tokenId].isSold = false;

        emit TokenListed(tokenId, price, msg.sender);
    }

    function unlistToken(uint256 tokenId) external onlyTokenOwner(tokenId) {
        require(_nfts[tokenId].listed, "Token is not listed");

        _nfts[tokenId].price = 0;
        _nfts[tokenId].listed = false;

        emit TokenUnlisted(tokenId);
    }

    function purchaseToken(uint256 tokenId) public payable {
        require(_exists(tokenId), "Token does not exist");
        require(_nfts[tokenId].listed, "Token is not listed");
        require(msg.value >= _nfts[tokenId].price, "Insufficient funds");

        address tokenSeller = ownerOf(tokenId);
        address tokenBuyer = msg.sender;

        _transfer(tokenSeller, tokenBuyer, tokenId);
        _nfts[tokenId].owner = tokenBuyer;
        _nfts[tokenId].listed = false;
        _nfts[tokenId].isSold = true;

        // Add the sold NFT to the seller's account
        _soldNFTs[tokenSeller].push(tokenId);

        emit TokenPurchased(tokenId, tokenBuyer, tokenSeller);
    }

    function getMintedNFTsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIds.current();
        uint256[] memory tokenIds = new uint256[](totalSupply);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_nfts[i].owner == owner) {
                tokenIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = tokenIds[i];
        }

        return result;
    }

    function getAvailableNFTs() public view returns (uint256[] memory) {
        uint256 totalSupply = _tokenIds.current();
        uint256[] memory availableNFTs = new uint256[](totalSupply);
        uint256 count = 0;

        for (uint256 i = 1; i <= totalSupply; i++) {
            if (_nfts[i].listed && _nfts[i].owner != address(0)) {
                availableNFTs[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = availableNFTs[i];
        }

        return result;
    }

    function getTokenDetails(uint256 tokenId) public view returns (
        address creator,
        address owner,
        uint256 price,
        bool listed,
        bool isSold
    ) {
        require(_exists(tokenId), "Token does not exist");

        NFT memory nft = _nfts[tokenId];

        return (
            nft.creator,
            nft.owner,
            nft.price,
            nft.listed,
            nft.isSold
        );
    }

    function getTokenCreatorById(uint256 tokenId) public view returns (address) {
        return _creators[tokenId];
    }

    function getSoldNFTs() public view returns (uint256[] memory) {
        return _soldNFTs[msg.sender];
    }
}
