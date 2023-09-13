import Navbar from "../Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../../pinata";

import NFT from '../../NFT.json';
import createNft from "./createNft"; 


export default function SellNFT() {
    const [formParams, updateFormParams] = useState({
        name: '', description: ''
    });
    const [fileURL, setFileURL] = useState(null);
    const ethers = require("ethers");
    const [message, updateMessage] = useState('');
    const [getImage, setImage] = useState('');


    async function disableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = true
        listButton.style.backgroundColor = "grey";
        listButton.style.opacity = 0.3;
    }

    async function enableButton() {
        const listButton = document.getElementById("list-button")
        listButton.disabled = false
        listButton.style.backgroundColor = "#A500FF";
        listButton.style.opacity = 1;
    }

    async function OnChangeFile(e) {

        var file = e.target.files[0];
        setImage(file);
        try {
            //upload the file to IPFS
            disableButton();
            updateMessage("Uploading image.. please dont click anything!")
            const response = await uploadFileToIPFS(file);
            if (response.success === true) {
                enableButton();
                updateMessage("")
                setFileURL(response.IpfsURL);
            }
        }
        catch (e) {
            console.log("Error during file upload", e);
        }
    }

    async function uploadMetadataToIPFS() {
        const { name, description } = formParams;
        if (!name || !description || !fileURL) {
            updateMessage("Please fill all the fields!")
            return -1;
        }

        const nftJSON = {
            name, description, image: fileURL
        }

        try {
            const response = await uploadJSONToIPFS(nftJSON);
            if (response.success === true) {
                return response.IpfsURL;
            }
        }
        catch (e) {
            console.log("error uploading JSON metadata:", e)
        }
    }

    async function listNFT(e) {
        e.preventDefault();

        try {
            const metadataURL = await uploadMetadataToIPFS();

            if (metadataURL === -1) {
                return;
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const addr = await signer.getAddress();
            disableButton();
            updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

            let Nftcontract = new ethers.Contract(NFT.address, NFT.abi, signer)
            let transaction = await Nftcontract.mintToken(metadataURL)
            const tx = await transaction.wait();
            const event = tx.events[0];
            const tokenId = event.args[2];
            
            createNft(formParams,tokenId, fileURL,addr)

            alert("Successfully Minted your NFT!");

            enableButton();
            updateMessage("");
            updateFormParams({ name: '', description: '' });

            window.location.replace("/profile")
            return tokenId;

        }
        catch (e) {
            alert("Upload error" + e)
        }
    }

    return (
        <div className="">
            <Navbar />
            <div className="flex flex-col place-items-center mt-10" id="nftForm">
                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
                    <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT</h3>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Name" onChange={e => updateFormParams({ ...formParams, name: e.target.value })} value={formParams.name}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Description" value={formParams.description} onChange={e => updateFormParams({ ...formParams, description: e.target.value })}></textarea>
                    </div>
                    <div>
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                        <input type={"file"} onChange={OnChangeFile}></input>
                    </div>
                    <br></br>
                    <div className="text-red-500 text-center">{message}</div>
                    <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg" id="list-button">
                        List NFT
                    </button>

                </form>
            </div>
        </div>
    )
}