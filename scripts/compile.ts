import { ethers } from "hardhat";

async function main() {
  const BaseToken = await ethers.getContractFactory("BaseToken");
  const bytecode = BaseToken.bytecode;
  console.log("Contract Bytecode:", bytecode);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 