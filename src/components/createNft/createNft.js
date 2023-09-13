function createNft(data,tokenId, image,owner) {
    console.log("========owner=======", image);
  
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("image_url", image);
    formData.append('token_id', tokenId)
    formData.append('owner',owner)
  
    const requestOptions = {
      method: 'POST',
      body: formData,
    };
  
    fetch('http://127.0.0.1:8000/api/create-nfts/', requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("======result=========", result);
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }
  
  export default createNft;
  