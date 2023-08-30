import { useParams } from 'react-router-dom';
import NFT from "../NFT.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import Navbar from './Navbar';

export default function NFTPage(props) {

    const [data, updateData] = useState({});
    const [dataFetched, updateDataFetched] = useState(false);
    const [message, updateMessage] = useState("");
    const [isListed, setListed] = useState();

    const [formParams, setFormParams] = useState({
        name: data.name,
        description: data.description,
        imageUrl: data.image,
        price: "",
    })

    async function getNFTData(tokenId) {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract(NFT.address, NFT.abi, signer)
        var tokenURI = await contract.tokenURI(tokenId);
        const info = await contract.getTokenDetails(tokenId);
        setListed(info.listed);

        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let item = {

            tokenId: tokenId,
            owner: info.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
            creator: info.creator
        }
        updateData(item);
        updateDataFetched(true);
    }
    async function sellNFT(tokenId) {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            let contract = new ethers.Contract(NFT.address, NFT.abi, signer);

            const salePrice = ethers.utils.parseUnits(formParams.price.toString());
            updateMessage("Listing the NFT... Please Wait (Upto 5 mins)")
            let transaction = await contract.listToken(tokenId, salePrice);
            await transaction.wait();
            alert('You successfully List the NFT!');
            updateMessage("");
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }

    async function unListNFT(tokenId) {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(NFT.address, NFT.abi, signer);
            updateMessage("Cancelling the NFT... Please Wait (Upto 5 mins)")
            let transaction = await contract.unlistToken(tokenId);
            await transaction.wait();
            alert('You successfully cancelled the NFT!');
            updateMessage("");
            window.location.replace("/")
        }
        catch (e) {
            alert("Upload Error" + e)
        }
    }
    const handleChange = (e) => {
        setFormParams({ ...data, price: e.target.value });
    };
    const params = useParams();
    const tokenId = params.tokenId;
    if (!dataFetched)
        getNFTData(tokenId);
    if (typeof data.image == "string")
        data.image = GetIpfsUrlFromPinata(data.image);

    return (
        <div style={{ "min-height": "100vh" }}>
            <Navbar />
            <div className="flex ml-20 mt-40" style={{ alignContent: 'center', justifyContent: 'center' }}>
                <img src={data.image} alt="" className="w-2/5" style={{ height: "55vh", width: '55vh', borderRadius: "10px" }} />
                <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5" style={{ height: "55vh" }}>
                    <div>
                        Name: {data.name}
                    </div>
                    <div>
                        Description: {data.description}
                    </div>
                    {!isListed &&
                        <div>
                            Price:
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-black bg-white leading-tight focus:outline-none focus:shadow-outline"
                                type="number"
                                placeholder="Min 0.01 ETH"
                                step="0.01"
                                value={formParams.price}
                                onChange={handleChange}
                            />
                        </div>}
                    <div>
                        Owner: <span className="text-sm">{data.owner}</span>
                    </div>
                    <div>
                        Creator: <span className="text-sm">{data.creator}</span>
                    </div>

                    <div>
                        {!isListed ?

                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" id="sell-button" onClick={() => { sellNFT(tokenId) }}>Sell this NFT</button> : <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={() => { unListNFT(tokenId) }}>Cancel this NFT</button>
                        }
                        <div className="text-green text-center mt-3">{message}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}