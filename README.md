<h1 align="center">
  <a href="https://github.com/ananya-bangera/Scaling-Ethereum-2024">
    <img src="https://github.com/ananya-bangera/Scaling-Ethereum-2024/assets/24823649/c41614e8-dc1a-45a7-89c5-9ef52888f955" alt="ZKnockXI Logo" width="125" height="125">
  </a>
  <br>
  ZKnockXI 
</h1>

<div align="center">
   <strong>ZKnockXI</strong> - A Privacy-Focused, Sybil-Resistant, Decentralized Fantasy Cricket Platform.🏏 <br>  
</div>

<hr>

<details>
<summary>Table of Contents</summary>

- [Description](#description)
- [Links](#links)
- [Tech Stack](#tech-stack)
- [Project Setup](#project-setup)
- [Contributors](#contributors)

</details>

## 📝Description

<table>
  <tr>
    <td>
ZKnockXI is a decentralized application that enables users to create and bet on fantasy sports teams in a secure, transparent, and trustless manner, leveraging the power of blockchain technology, decentralized storage solutions, and oracle services.
<br><br>
      <strong>Limitations</strong> of existing fantasy cricket platforms like <i>Dream11</i>:
      <ul>
<li> Dream11 has faced multiple instances of leaked player team data before matches, raising significant concerns about user privacy and the need for stronger data protection measures within the fantasy sports realm.
<li> Dream11 is embroiled in legal disputes due to the pervasive use of bots, which distort fair competition by artificially inflating betting pools. These automated entities erode the platform's integrity, necessitating urgent measures to uphold equitable gaming standards for all participants.
<li> Dream11's lack of transparency with its scoring system breeds distrust among players, who question the accuracy of leaderboards. Ensuring fairness and clarity is vital for the trust and satisfaction of fantasy sports enthusiasts.
      </ul>
<strong>ZKnock's Approach</strong> to solve these <i>problems</i>:
      <ol>
<li> ZKnockXI leverages decentralized technologies like Filecoin, Witness Protocol, Sign Protocol, and Chainlink, eliminating the need for a centralized authority or intermediary. This ensures transparency, fairness, and trustlessness, as the entire process is executed on decentralized networks without relying on a single entity.
<li> User data, such as team compositions and timestamps, are securely stored on the decentralized Filecoin network, encrypted with digital signatures to ensure integrity and authenticity. The DApp generates a "squad hash" using Merkle hashes, timestamps, and user addresses, ensuring the immutability of submitted teams. The Witness Protocol and Sign Protocol are used to create and verify prrofs and attestations respectively, providing proof of squad submissions and preventing tampering.
<li> The integration of witness and sign attestations prevents Sybil attacks, ensuring that only legitimate users can participate in the betting process.This Two-factor Authorization (2FA) system further enhances security and user legitimacy.
<li> ZKnockXI utilizes Chainlink's decentralized oracle network via Chainlink Functions to calculate individual player scores and total team scores, ensuring reliability and trustworthiness. This eliminates the need for a centralized entity to calculate and report scores, reducing the potential for manipulation or errors.
<li> After verifying the legitimacy of user squads through the Witness Protocol and Sign Protocol, the DApp can accurately distribute rewards to the winners based on the decentralized score calculations from Chainlink. The transparent and tamper-proof nature of the betting process ensures fairness for all participants.
<li> By leveraging decentralized technologies, users have greater control over their data and can participate in the betting process without revealing unnecessary personal information to a centralized authority.
      </ol>
<br> Through this seamless combination of cutting-edge technologies, our protocol delivers a secure, fair, and transparent fantasy sports experience, setting a new standard for the industry.
    </td>
  </tr>
  </table>

![Select A Match](https://github.com/ananya-bangera/Scaling-Ethereum-2024/assets/24823649/96ee41b2-7f05-496b-8dfa-594d09c3499f)

  
## 🔗Links

### Assets
- [GitHub Repo](https://github.com/ananya-bangera/Scaling-Ethereum-2024)
- [EthGlobal Submission]()
- [Demo Video](https://youtu.be/02FEYevnfGE)

### Deployed Protocol Contract
- [Arbitrum Sepolia Testnet](https://sepolia.arbiscan.io/address/0x51254Af0A3984161D937dbCa3460AA4837254299)

### Oracle Server
- [Chainlink Functions Subscription on Arbitrum Sepolia](https://functions.chain.link/arbitrum-sepolia/55)
- [Score Calculation Oracle Server](https://puce-smoggy-clam.cyclic.app)

### Sign Protocol Attestations and Schema
- [Sign Protocol Schema](https://testnet-scan.sign.global/schema/onchain_evm_421614_0x30)

## 🤖Tech-Stack

- NextJS + Hardhat from Scaffold-Eth-2 Template for Project Setup
- Solidity for Smart Contracts
- Chainlink Functions for Oracle Score Calculation Integration with Smart Contract

## 🛠Project Setup

To get ZKnockXI run locally, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/ananya-bangera/Scaling-Ethereum-2024.git
cd .\ZKnockXI\
yarn
```

2. Start your NextJS app:

```
yarn start
```

## 👩‍💻Contributors

Team Members

- [Sarvagnya Purohit](https://github.com/saRvaGnyA) 
- [Ananya Bangera](https://github.com/ananya-bangera) 
- [Harsh Nag](https://github.com/Jigsaw-23122002) 
