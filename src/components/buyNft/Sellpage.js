import Navbar from "../Navbar";
import { useParams } from 'react-router-dom';
import MarketplaceJSON from "../../NFT.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../../utils";


export default function SellPage(props) {
    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [currAddress, updateCurrAddress] = useState("0x");

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
        var tokenURI = await contract.tokenURI(tokenId);
        // const listedToken = await contract.getTokenCreatorById(tokenId);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        const price = await contract.getTokenDetails(tokenId).then((details) => details.price);
        const data = await contract.getTokenDetails(tokenId);
        meta = meta.data;
        let item = {
            tokenId: tokenId,
            seller: data.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            price: ethers.utils.formatEther(price)
        }
        updateData(item);
        updateDataFetched(true);
        updateCurrAddress(addr);
    }
    async function buyNFT(tokenId) {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')
            updateMessage("Buying the NFT... Please Wait (Upto 5 mins)")
            let transaction = await contract.purchaseToken(tokenId, { value: salePrice });
            await transaction.wait();
            alert('You successfully bought the NFT!');
            updateMessage("");
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }
    async function cancel(tokenId) {
        try {
            let url = `http://127.0.0.1:8001/api/cancel-listed-nft/`
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

            updateMessage("Cancel the NFT... Please Wait (Upto 5 mins)")
            let transaction = await contract.unlistToken(tokenId);
            await transaction.wait();
            await axios.post(url, {token_id:tokenId})
            alert('You successfully Cancel the NFT!');
            updateMessage("");
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }


    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);
    if (typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);
    return (
        <div style={{ "min-height": "100vh", }}>
            <Navbar></Navbar>
            <div className="flex ml-20 mt-40" style={{ alignContent: 'center', justifyContent: 'center' }}>
                <img src={data.image} alt="" className="w-2/5" style={{ height: "50vh", width: '50vh', borderRadius: "10px" }} />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5" style={{ height: "50vh" }}>
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    <div>
                        Price: <span className="">{data.price + " ETH"}</span>
                    </div>
                    <div>
                        Seller: <span className="text-sm">{data.seller}</span>
                    </div>
                    <div>
                        {currAddress !== data.owner && currAddress !== data.seller ? (
                            <>
                                <button className="enable bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => buyNFT(tokenId)}>Buy this NFT</button>
                            </>
                        ) : (
                            <>
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => cancel(tokenId)}>Cancel</button>

                                <div className="text-emerald-700">You are the owner of this NFT</div>
                            </>
                        )}

                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}