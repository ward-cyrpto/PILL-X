// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title PillX
 * @notice PILL-X: Physical Digital Asset with NFC Serial Number NFT Twins
 * @dev ERC-721 with royalties (ERC-2981), three tiers, NFC serial binding,
 *      and multi-chain deployment support (Ethereum, Polygon, BSC, Avalanche, etc.)
 */
contract PillX is ERC721, ERC721URIStorage, ERC721Royalty, Ownable, ReentrancyGuard, Pausable {
    using Address for address payable;

    // ─── Tier Definitions ─────────────────────────────────────────────────────

    enum Tier { COMMON, PREMIUM, GOLD }

    struct TierConfig {
        uint256 price;          // Price in wei (set per-chain via owner)
        uint256 maxSupply;
        uint256 minted;
        string  name;
    }

    // ─── State ────────────────────────────────────────────────────────────────

    mapping(Tier => TierConfig) public tiers;

    /// @dev tokenId => NFC serial number (hex string, e.g. "A1B2C3D4E5F6")
    mapping(uint256 => string) public nfcSerial;

    /// @dev NFC serial => tokenId (reverse lookup, 0 = unminted)
    mapping(string => uint256) public serialToToken;

    /// @dev tokenId => Tier
    mapping(uint256 => Tier) public tokenTier;

    /// @dev Per-tier token ID counter offsets
    ///      Common:  1 – 30,000
    ///      Premium: 30,001 – 37,500
    ///      Gold:    37,501 – 40,000
    uint256 private constant COMMON_START   = 1;
    uint256 private constant PREMIUM_START  = 30_001;
    uint256 private constant GOLD_START     = 37_501;

    string  public baseMetadataURI;

    /// @dev Address that receives sale proceeds (used for on-chain royalty recipient)
    address public paymentRecipient;

    // ─── Events ───────────────────────────────────────────────────────────────

    event PillMinted(
        address indexed to,
        uint256 indexed tokenId,
        Tier    indexed tier,
        string  nfcSerial
    );

    event TierPriceUpdated(Tier tier, uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);
    event PaymentRecipientUpdated(address newRecipient);

    // ─── Constructor ──────────────────────────────────────────────────────────

    /**
     * @param _baseMetadataURI  Base URI for token metadata (e.g. "https://pill-x.com/api/metadata/")
     * @param _paymentRecipient Address receiving royalties and sale proceeds
     * @param _commonPriceWei   Common pill price in wei
     * @param _premiumPriceWei  Premium pill price in wei
     * @param _goldPriceWei     Gold pill price in wei
     */
    constructor(
        string  memory _baseMetadataURI,
        address        _paymentRecipient,
        uint256        _commonPriceWei,
        uint256        _premiumPriceWei,
        uint256        _goldPriceWei
    )
        ERC721("PILL-X", "PILLX")
        Ownable(msg.sender)
    {
        require(_paymentRecipient != address(0), "PillX: zero recipient");

        baseMetadataURI    = _baseMetadataURI;
        paymentRecipient   = _paymentRecipient;

        // 500 basis points = 5% royalty on secondary sales
        _setDefaultRoyalty(_paymentRecipient, 500);

        tiers[Tier.COMMON]  = TierConfig(_commonPriceWei,  30_000, 0, "Common");
        tiers[Tier.PREMIUM] = TierConfig(_premiumPriceWei,  7_500, 0, "Premium");
        tiers[Tier.GOLD]    = TierConfig(_goldPriceWei,     2_500, 0, "Gold");
    }

    // ─── Minting ──────────────────────────────────────────────────────────────

    /**
     * @notice Mint a PILL-X NFT by paying the tier price.
     * @param tier       Tier to mint (0=Common, 1=Premium, 2=Gold)
     * @param serial     NFC serial number assigned to this physical pill
     */
    function mint(Tier tier, string calldata serial)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        TierConfig storage cfg = tiers[tier];
        require(msg.value >= cfg.price,         "PillX: insufficient payment");
        require(cfg.minted < cfg.maxSupply,     "PillX: tier sold out");
        require(bytes(serial).length > 0,       "PillX: empty serial");
        require(serialToToken[serial] == 0,     "PillX: serial already used");

        uint256 tokenId = _nextTokenId(tier);
        cfg.minted++;

        nfcSerial[tokenId]      = serial;
        serialToToken[serial]   = tokenId;
        tokenTier[tokenId]      = tier;

        string memory uri = string(abi.encodePacked(baseMetadataURI, _uint2str(tokenId), ".json"));
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);

        // Forward payment to recipient using Address.sendValue (safer than low-level call)
        payable(paymentRecipient).sendValue(msg.value);

        emit PillMinted(msg.sender, tokenId, tier, serial);
    }

    /**
     * @notice Owner-only batch mint (for pre-allocations / giveaways).
     */
    function ownerMint(
        address         to,
        Tier            tier,
        string calldata serial
    )
        external
        onlyOwner
    {
        TierConfig storage cfg = tiers[tier];
        require(cfg.minted < cfg.maxSupply, "PillX: tier sold out");
        require(bytes(serial).length > 0,   "PillX: empty serial");
        require(serialToToken[serial] == 0, "PillX: serial already used");

        uint256 tokenId = _nextTokenId(tier);
        cfg.minted++;

        nfcSerial[tokenId]    = serial;
        serialToToken[serial] = tokenId;
        tokenTier[tokenId]    = tier;

        string memory uri = string(abi.encodePacked(baseMetadataURI, _uint2str(tokenId), ".json"));
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        emit PillMinted(to, tokenId, tier, serial);
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function setTierPrice(Tier tier, uint256 priceWei) external onlyOwner {
        tiers[tier].price = priceWei;
        emit TierPriceUpdated(tier, priceWei);
    }

    function setBaseMetadataURI(string calldata uri) external onlyOwner {
        baseMetadataURI = uri;
        emit BaseURIUpdated(uri);
    }

    function setPaymentRecipient(address recipient) external onlyOwner {
        require(recipient != address(0), "PillX: zero recipient");
        paymentRecipient = recipient;
        _setDefaultRoyalty(recipient, 500);
        emit PaymentRecipientUpdated(recipient);
    }

    function pause()   external onlyOwner { _pause(); }
    function unpause() external onlyOwner { _unpause(); }

    // ─── Views ────────────────────────────────────────────────────────────────

    function totalMinted() external view returns (uint256) {
        return tiers[Tier.COMMON].minted
             + tiers[Tier.PREMIUM].minted
             + tiers[Tier.GOLD].minted;
    }

    function remainingSupply(Tier tier) external view returns (uint256) {
        TierConfig storage cfg = tiers[tier];
        return cfg.maxSupply - cfg.minted;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    function _nextTokenId(Tier tier) internal view returns (uint256) {
        if (tier == Tier.COMMON)  return COMMON_START  + tiers[Tier.COMMON].minted;
        if (tier == Tier.PREMIUM) return PREMIUM_START + tiers[Tier.PREMIUM].minted;
        return GOLD_START + tiers[Tier.GOLD].minted;
    }

    function _uint2str(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 temp = v;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buf = new bytes(digits);
        while (v != 0) { digits--; buf[digits] = bytes1(uint8(48 + (v % 10))); v /= 10; }
        return string(buf);
    }

    // ─── Overrides required by Solidity ───────────────────────────────────────

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721URIStorage, ERC721Royalty)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
