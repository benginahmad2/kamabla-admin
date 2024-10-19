import { useEffect } from "react";

import { getInittx, getdepotx, getwidrtx } from "../../contract/instructions"
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { useUserContext } from "../../contexts/UserContext";
import { useWallet } from "@solana/wallet-adapter-react";
// import { PublicKey } from "@solana/web3.js";

import styled from "styled-components";
// import { AnchorWallet } from "@solana/wallet-adapter-react"

const Initialize = () => {
    const { publicKey, connected } = useWallet();
    const { connection } = useConnection()
    const wallet = useAnchorWallet();
    const { setIsConnected, setPubkey } = useUserContext();


    const depoamount = 10000;
    const widramount = 5;




    const CustomButton = styled.div`
        border: none;
        color: #fff;
        cursor: pointer;
      
        font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 16px;
        font-weight: 600;
        height: 48px;
        line-height: 48px;
        padding: 0 24px;
        border-radius: 4px;
        background-color: #512da8;
        margin: 15px;
        text-align: center;
        width: 100%;
    `
    const Main = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: sans-serif;
        margin-top: 50px;
    `


    useEffect(() => {
        setIsConnected(connected);
        if (!publicKey) {
            console.log("Wallet not connected")

        } else {
            setPubkey(publicKey);
        }
    }, [connected]);
    console.log(connection);
    console.log(wallet);

    if (!connection || !wallet || (wallet && !wallet.publicKey)) {
        console.log("Wallet not connected")
        return
    }
    const onInitialize = async () => {
        try {

            await getInittx(wallet, connection)


        } catch (error) {
            console.log("On initialize error ", error)
            return
        }

    }

    const ondeposit = async () => {


        try {

            await getdepotx(wallet, connection, depoamount)
        } catch (error) {
            console.log("On deposit error ", error)
            return
        }


    }

    const onwithdraw = async () => {


        try {

            await getwidrtx(wallet, connection, widramount)
        } catch (error) {
            console.log("On deposit error ", error)
            return
        }


    }




    return (
        <Main>

            <CustomButton onClick={onInitialize}>Initialize</CustomButton>
            <CustomButton onClick={ondeposit}>Deposit token</CustomButton>
            <CustomButton onClick={onwithdraw}>Withdraw token</CustomButton>
        </Main>
    )
}

export default Initialize