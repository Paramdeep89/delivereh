# Getting Started with Create React App

# 🚛 SecureChain by Delivereh

**SecureChain** is a decentralized cargo registration and access control system built by **Delivereh** to bring trust, transparency, and tamper-proof logistics to last-mile delivery. Built at the #EasyAConsensusHackathon, SecureChain enforces cargo policies on-chain using a **simulated Forte Rules Engine (FRE)** and role-based permissions.

> 🔐 Built with Solidity + React + Simulated FRE compatibility

---

## 🔍 Features

- ✅ **Driver Verification** – only verified drivers can register cargo
- ✅ **Cargo Locking** – inspectors can lock cargo flagged for review
- ✅ **Stablecoin Deposit Enforcement** – minimum collateral required for access
- ✅ **Weight-Based Restrictions** – cargo over threshold is rejected
- ✅ **Tamper-Proof History** – every status change is immutably recorded on-chain
- ✅ **Role Management** – admin can assign/revoke Driver or Inspector roles
- ✅ **Simulated FRE** – `PolicyEvaluator` contract mimics Forte’s rule evaluation logic

---

## 🧠 Tech Stack

| Layer | Tech |
|-------|------|
| Smart Contracts | Solidity (EVM-compatible), Hardhat |
| Frontend        | React, Ethers.js, MetaMask |
| Policy Engine   | Simulated Forte Rules Engine (`PolicyEvaluator.sol`) |
| Network         | Hardhat local development chain (Chain ID: 31337) |

---

## 💡 Architecture

### 1. `SecureChain.sol`
Manages:
- Role-based access (`assignRole`, `revokeRole`)
- Cargo registration
- Cargo status updates
- Inspector-initiated cargo locks
- On-chain event log (cargo history)

### 2. `PolicyEvaluator.sol`
Simulates FRE logic:
- `evaluate(address, weight)` checks if:
  - Driver is verified
  - Cargo weight ≤ 1000kg
  - Stablecoin deposit ≥ 100 units

---

## 🖥️ React Frontend Components

| Component           | Purpose |
|---------------------|---------|
| `WalletConnect`     | Connect MetaMask wallet |
| `RoleActions`       | Assign or revoke roles (Admin only) |
| `VerifyDriver`      | Mark a driver as verified (Admin only) |
| `DepositStablecoin` | Fund stablecoin deposit for a driver (Admin only) |
| `CargoRegister`     | Register new cargo (Verified Drivers only) |
| `UpdateCargoStatus` | Update cargo status to `InTransit`, `Delivered`, or `Locked` |
| `LockCargo`         | Inspectors can directly lock cargo |
| `CargoHistory`      | View event history for any cargo ID |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MetaMask
- Hardhat

### Clone & Install

```bash
git clone https://github.com/your-username/securechain-dapp.git
cd securechain-dapp
npm install


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
