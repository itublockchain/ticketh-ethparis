import { type Nft, NftTokenType } from 'alchemy-sdk';

export const mockNFTs: Array<Nft> = [
    {
        contract: {
            address: '0xf5cb1a568e5a0ac4e4199662894604a49ca60cd8',
            name: 'lamo',
            totalSupply: '3',
            tokenType: NftTokenType.ERC721,
            openSea: {},
        },
        tokenId: '1',
        tokenType: NftTokenType.ERC721,
        title: 'fofq',
        description: '',
        timeLastUpdated: '2023-07-22T19:35:25.674Z',
        rawMetadata: {
            image: 'ipfs://QmR9Fn1Dvpd7Wx1o9ZYeA2KevdCHm6JSYahy5DPsdW7w2R/DP.png',
            external_url: '',
            background_color: '',
            name: 'fofq',
            description: '',
            customImage: '',
            customAnimationUrl: '',
        },
        tokenUri: {
            gateway:
                'https://alchemy.mypinata.cloud/ipfs/QmS1Z45PFsa157AAuTyBDfefZLvk8LiihxxsdRPdqpeKuA/0',
            raw: 'ipfs://QmS1Z45PFsa157AAuTyBDfefZLvk8LiihxxsdRPdqpeKuA/0',
        },
        media: [
            {
                gateway:
                    'https://ipfs.io/ipfs/QmR9Fn1Dvpd7Wx1o9ZYeA2KevdCHm6JSYahy5DPsdW7w2R/DP.png',
                raw: 'ipfs://QmR9Fn1Dvpd7Wx1o9ZYeA2KevdCHm6JSYahy5DPsdW7w2R/DP.png',
            },
        ],
        metadataError: '',
    },
];
