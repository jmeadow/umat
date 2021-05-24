const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType, Percent } = require('@uniswap/sdk');
const ethers = require('ethers');

const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

const init = async () => {
  // written 7:00-13:30
  const dai = await Fetcher.fetchTokenData(chainId, tokenAddress); // 
  const weth = WETH[chainId];
  const pair = await Fetcher.fetchPairData(dai, weth); // order doesn't matter
  const route = new Route([pair], weth); // need to pass seceral elements if its a new pair (11:14)
  console.log(route.midPrice.toSignificant(6)); // number of DAI you get for 1 WETH
  console.log(route.midPrice.invert().toSignificant(6)); // number of WETH you can get for 1 DAI

  // 13:40
  const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT); // adds 100 ether (w decimals) to get back DAI
  console.log(trade.executionPrice.toSignificant(6)); // execution price
  console.log(trade.nextMidPrice.toSignificant(6)); // price goes down

  // 16:50
  const slippageTolerance = new Percent('50', '10000'); // willing to accept a price up to 0.5% worse than quote
  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw; // the minimum amount of DAI we are willing to accept (18:00)
  const path = [weth.address, dai.address]; // array of addresses of the pair
  const to = ''; // address of recipient
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // +60*20 means adds 20 minutes to the Date.now()
  const value = trade.inputAmount.raw; // how much ether we are willing to send

  // 19:20 
  // this is needed because the SDK only allows for read access, so we use infura to send transactions
  const provider = ethers.getDefaultProvider('mainnet', {
    infura: 'https://mainnet.infura.io/v3/ba14d1b3cfe5405088ee3c65ebd1d4db' 
  });

  const signer = new ethers.Wallet(PRIVATE_KEY); // specifies your private key (universal variable?)
  const account = signer.connect(provider); // connects
  const uniswap = new ethers.Contract( 
    // uniswap router02 contract address
    // ,raw ABI code
    // ,account to send command from
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', 
    ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) //external payable returns (uint[] memory amounts)'],
    account
  );
  const tx = await uniswap.sendExactETHForTokens( // 23:10
    amountOutMin,
    path,
    to,
    deadline,
    { value, gasPrice: 20e9 } // ethers has something that can do this programmatically
  );
  console.log(`Transaction hash: ${tx.hash}`);

  const receipt = await tx.wait(); 
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

init();