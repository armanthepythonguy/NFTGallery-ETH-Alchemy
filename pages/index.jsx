import { useState } from "react"
import { NFTCard } from "../components/nftCard"

const Home = () =>{

  const [wallet, setWalletAddress] = useState("")
  const [collection, setCollectionAddress] = useState("")
  const [NFTs, setNFTs] = useState([])
  const [fetchForCollection, setFetchForCollection] = useState(false)

  const fetchNFTs = async()=>{
    let nfts;
    const apiURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_apiKey}/getNFTs/`
    var requestOptions = {
      method: 'GET'
    }
    if(!collection.length){
      const fetchURL = `${apiURL}?owner=${wallet}`
      nfts = await fetch(fetchURL, requestOptions).then(data=>data.json())
    }else{
      const fetchURL = `${apiURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`
      nfts = await fetch(fetchURL, requestOptions).then(data=>data.json())
    }
    if(nfts){
      console.log(nfts)
      setNFTs(nfts.ownedNfts)
    }
  }

  const fetchNFTsforCollection = async()=>{
    if(collection.length){
      var requestOptions= {
        method:'GET'
      }
      const apibaseURL = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_apiKey}/getNFTsForCollection/`
      const apifetchURL = `${apibaseURL}?contractAddress=${collection}&withMetadata=${"true"}`
      let nfts = await fetch(apifetchURL, requestOptions).then(data=>data.json())
      if (nfts) {
        console.log("NFTs in collection:", nfts)
        setNFTs(nfts.nfts)
      }
    }
  }

  return(
    <div className={'flex flex-col items-center justify-center py-8 gap-y-3'}>
      <div className={'flex flex-col w-full justify-center items-center gap-y-2'}>
        <input type={"text"} disabled={fetchForCollection} placeholder="Add your wallet address" onChange={(e)=>{setWalletAddress(e.target.value)}} value={wallet}></input>
        <input type={"text"} placeholder="Add the collection address" onChange={(e)=>{setCollectionAddress(e.target.value)}} value={collection}></input>
        <label className={"text-gray-600 "}><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className={"mr-2"}></input>Fetch for collection</label>
        <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          ()=>{
            if(fetchForCollection){
              fetchNFTsforCollection()
            }else{
              fetchNFTs()
            }
          }
        }>Let's go! </button>
        </div>
        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length && NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          })
        }
      </div>
    </div>
  )
}

export default Home