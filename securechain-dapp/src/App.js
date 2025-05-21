import { useState, useEffect } from "react";
import { ethers } from "ethers";
import WalletConnect from "./components/WalletConnect";
import CargoRegister from "./components/CargoRegister";
import CargoHistory from "./components/CargoHistory";
import RoleActions from "./components/RoleActions";
import UpdateCargoStatus from "./components/UpdateCargoStatus";
import LockCargo from "./components/LockCargo";
import useUserRole from "./hooks/useUserRole";
import SupportPrompt from "./components/SupportPrompt";
import VerifyDriver from "./components/VerifyDriver";
import DepositStablecoin from "./components/DepositStablecoin";

import { Tabs, Tab, Box, Typography } from "@mui/material";

import POLICY_EVALUATOR_ARTIFACT from "./abi/PolicyEvaluator.json";
const POLICY_EVALUATOR_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const POLICY_EVALUATOR_ABI = POLICY_EVALUATOR_ARTIFACT.abi;

function App() {
  const [signer, setSigner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState(null);
  const [isVerifiedDriver, setIsVerifiedDriver] = useState(null);
  const [tab, setTab] = useState(0);

  const handleConnected = ({ address, signer, provider }) => {
    setAddress(address);
    setSigner(signer);
    setProvider(provider);
  };

  const { role, isOwner } = useUserRole(address);

  useEffect(() => {
    const checkVerification = async () => {
      if (!signer || !address) return;
      try {
        const contract = new ethers.Contract(
          POLICY_EVALUATOR_ADDRESS,
          POLICY_EVALUATOR_ABI,
          signer
        );
        const isVerified = await contract.verifiedDrivers(address);
        setIsVerifiedDriver(isVerified);
      } catch (error) {
        console.error("Error checking verified driver status:", error);
        setIsVerifiedDriver(null);
      }
    };

    checkVerification();
  }, [signer, address]);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <div className="App" style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h1 style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <img src="/DeliverehLogo.jpg" alt="Logo" style={{ height: "40px" }} />
            delivereh.
          </h1>
        </div>

        <WalletConnect onConnected={handleConnected} />

        {address && (
          <>
            <section>
              {isOwner && (
                <p className="status-success">🔑 You are the contract owner.</p>
              )}

              {role === 1 && isVerifiedDriver === true && (
                <p style={{ color: "green" }}>✅ You are a verified driver.</p>
              )}
              {role === 1 && isVerifiedDriver === false && (
                <p style={{ color: "red" }}>❌ You are not a verified driver.</p>
              )}
              {!isOwner && role === 0 && (
                <p style={{ color: "red" }}>
                  ❌ No role assigned. Please contact the contract owner to get access.
                </p>
              )}
              {!isOwner && role === null && (
                <p style={{ color: "orange" }}>🔄 Checking your role...</p>
              )}
            </section>


            <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
              <Tabs
                value={tab}
                onChange={handleTabChange}
                sx={{
                  backgroundColor: "#fdecea", // soft red background
                  borderRadius: "8px 8px 0 0",
                  px: 2
                }}
                TabIndicatorProps={{
                  style: { backgroundColor: "#d32f2f" } // deep red indicator
                }}
                textColor="inherit"
              >
                <Tab
                  label="Role Management"
                  sx={{ color: "#b71c1c", fontWeight: "bold" }}
                />
                <Tab
                  label="Cargo Actions"
                  sx={{ color: "#b71c1c", fontWeight: "bold" }}
                />
                <Tab
                  label="Cargo History"
                  sx={{ color: "#b71c1c", fontWeight: "bold" }}
                />
              </Tabs>
            </Box>




            {/* Role Management Tab */}
            {tab === 0 && (
              <Box mt={2}>
                {isOwner && <RoleActions signer={signer} />}
                {isOwner && <VerifyDriver signer={signer} />}
                {isOwner && <DepositStablecoin signer={signer} />}
              </Box>
            )}

            {/* Cargo Actions Tab */}
            {tab === 1 && (
              <Box mt={2}>
                {(role === 1 || isOwner) && (
                  <>
                    <CargoRegister signer={signer} />
                    <UpdateCargoStatus signer={signer} role={role} isOwner={isOwner} />
                  </>
                )}
                {(role === 2 || isOwner) && <LockCargo signer={signer} />}
              </Box>
            )}

            {/* Cargo History Tab */}
            {tab === 2 && (
              <Box mt={2}>
                <CargoHistory provider={provider} />
              </Box>
            )}
          </>
        )}
      </div>

      <SupportPrompt />
    </>
  );
}

export default App;
