import Initialize from "../../components/section/Initialize.tsx";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import styled from "styled-components";

const Home = () => {
  const { publicKey } = useWallet();
  const MainPage = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: sans-serif;
        margin-top: 50px;
    `


  const isAuthorizedWallet =
    publicKey && publicKey.toBase58() === "GUvxg94YmJwdrx3edxsagLBAh88JriWrsRv1CC4h7yss";

  return (
    <MainPage>
      <h1>KAMABLA ADMIN</h1>
      <WalletMultiButton />
      {isAuthorizedWallet && <Initialize />}
    </MainPage>
  );
};

export default Home;
