import { encode as base64_encode } from 'base-64';
import { create } from 'ipfs-http-client';

const secrets = "2PZ34Qzw9oYycOIxjV9v7w1I9cI:43ad0539c99f97ae534e37f04baff86e";
const encodedSecrets = base64_encode(secrets);
const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    Authorization: 'Basic ' + encodedSecrets,
  },
});

export const uploadJSONToIPFS = async (JSONBody) => {
  try {
    const response = await ipfs.add(JSON.stringify(JSONBody));
    return {
      success: true,
      IpfsURL: "https://ipfs.io/ipfs/" + response.cid.toString(),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export const uploadFileToIPFS = async (buffer) => {
  try {
    const response = await ipfs.add(buffer);
    return {
      success: true,
      IpfsURL: "https://ipfs.io/ipfs/" + response.cid.toString(),
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: error.message,
    };
  }
};
