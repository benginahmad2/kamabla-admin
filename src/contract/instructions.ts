import kamabla from './idl/idl.json'
import { ComputeBudgetProgram, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { Program, Idl, AnchorProvider, setProvider } from "@coral-xyz/anchor";
// import type { LockiToken } from "@/types";
import { AnchorWallet } from "@solana/wallet-adapter-react"
import { TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { BN } from "bn.js";
// import { program } from '@coral-xyz/anchor/dist/cjs/native/system';
const GLOBAL_SEED: string = "GLOBAL_SEED"
const programId = new PublicKey('3Rkvu1d2qsSTzNjqjeVD29h1HHNADY6NHh25BARHCCj2');
const mintaddress = new PublicKey('6BuKbBATFnUF34g97Vtni5Xq8qNyzYD412SaEBoStPKU');
// const amount = 15;
// const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export const getInittx = async (wallet: AnchorWallet, connection: Connection) => {
    console.log("calling Initialize...")
    try {
        if (!wallet.publicKey || !connection) {
            console.log("Warning:Wallet not connected")
            return
        }

        console.log(connection);
        console.log("==============", wallet.publicKey.toBase58());

        const provider = new AnchorProvider(connection, wallet, {});
        setProvider(provider);
        const program = new Program(kamabla as Idl, programId);
        // const program = new Program(kamabla as Idl) as Program<LockiToken>;

        console.log("Program programid", program.programId.toBase58())

        const [globalState] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], program.programId);

        console.log("🚀 ~ globalState:", globalState.toBase58());
        console.log("Program", program, "\n", wallet.publicKey.toBase58())

        const initTx = new Transaction().add(
            ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 }),
            await program.methods.initialize().accounts({
                admin: wallet.publicKey,
                mint: mintaddress,
                globalState,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId
            }).instruction()
        )
        console.log("🚀 ~ transaction:", initTx)

        try {
            initTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            initTx.feePayer = wallet.publicKey
            console.log(await connection.simulateTransaction(initTx))
            if (wallet.signTransaction) {
                const signedTx = await wallet.signTransaction(initTx)
                const sTx = signedTx.serialize()
                const signature = await connection.sendRawTransaction(sTx, { skipPreflight: true })

                const blockhash = await connection.getLatestBlockhash()
                await connection.confirmTransaction({
                    signature,
                    blockhash: blockhash.blockhash,
                    lastValidBlockHeight: blockhash.lastValidBlockHeight
                }, "confirmed");
                console.log("Successfully initialized.\n Signature: ", signature);
            }
        } catch (error) {
            console.log("Error in lock transaction", error)
        }



    } catch (error) {
        console.log("Error in making initialize transaction", error)
        return
    }
}






export const getdepotx = async (wallet: AnchorWallet, connection: Connection, amount: number) => {
    console.log("calling deposit...")
    try {
        if (!wallet.publicKey || !connection) {
            console.log("Warning:Wallet not connected")
            return
        }

        console.log(connection);
        console.log("==============", wallet);

        const provider = new AnchorProvider(connection, wallet, {});
        setProvider(provider);
        const program = new Program(kamabla as Idl, programId);
        // const program = new Program(kamabla as Idl) as Program<LockiToken>;

        console.log("Program programid", program.programId.toBase58())

        const [globalState] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], program.programId);

        console.log("🚀 ~ globalState:", globalState.toBase58());
        console.log("Program", program, "\n", wallet.publicKey.toBase58())


        const adminAta = await getAssociatedTokenAddress(
            mintaddress, wallet.publicKey
        )
        const depositTx = new Transaction().add(
            ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 }),)


        const globalStateAta = await getAssociatedTokenAddress(mintaddress, globalState, true)

        console.log("globalStateAta:", globalStateAta.toBase58())
        console.log(await connection.getAccountInfo(globalStateAta), "`````````~~~~~~~~~")
        if (await connection.getAccountInfo(globalStateAta) == null) {
            console.log("User lock lp token for a first time")
            depositTx.add(createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                globalStateAta,
                globalState,
                mintaddress
            ))
        }

        console.log("adminAta", adminAta, adminAta.toBase58())
        console.log("globalStateAta", globalStateAta, globalStateAta.toBase58())


        const _amount = new BN(amount).mul(new BN(10 ** 8))
        const instruction = await program.methods.deposit(_amount).accounts({
            globalState,
            admin: wallet.publicKey,
            mint: mintaddress,
            adminTokenAccount: adminAta,
            globalStateTokenAccount: globalStateAta,
            tokenProgram: TOKEN_PROGRAM_ID,

        }).instruction()
        depositTx.add(instruction)
        console.log("🚀 ~ transaction:", depositTx)

        try {
            depositTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            depositTx.feePayer = wallet.publicKey
            console.log(await connection.simulateTransaction(depositTx))
            if (wallet.signTransaction) {
                const signedTx = await wallet.signTransaction(depositTx)
                const sTx = signedTx.serialize()
                const signature = await connection.sendRawTransaction(sTx, { skipPreflight: true })

                const blockhash = await connection.getLatestBlockhash()
                await connection.confirmTransaction({
                    signature,
                    blockhash: blockhash.blockhash,
                    lastValidBlockHeight: blockhash.lastValidBlockHeight
                }, "confirmed");
                console.log("Successfully initialized.\n Signature: ", signature);
            }
        } catch (error) {
            console.log("Error in lock transaction", error)
        }

    } catch (error) {
        console.log("Error in making initialize transaction", error)
        return
    }
}


export const getwidrtx = async (wallet: AnchorWallet, connection: Connection, amount: number) => {
    console.log("calling withdraw...")
    try {
        if (!wallet.publicKey || !connection) {
            console.log("Warning:Wallet not connected")
            return
        }

        console.log(connection);
        console.log("==============", wallet);

        const provider = new AnchorProvider(connection, wallet, {});
        setProvider(provider);
        const program = new Program(kamabla as Idl, programId);
        // const program = new Program(kamabla as Idl) as Program<LockiToken>;

        console.log("Program programid", program.programId.toBase58())

        const [globalState] = PublicKey.findProgramAddressSync([Buffer.from(GLOBAL_SEED)], program.programId);

        console.log("🚀 ~ globalState:", globalState.toBase58());
        console.log("Program", program, "\n", wallet.publicKey.toBase58())


        const adminAta = await getAssociatedTokenAddress(
            mintaddress, wallet.publicKey
        )
        const withdrawTx = new Transaction().add(
            ComputeBudgetProgram.setComputeUnitLimit({ units: 100_000 }),
            ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 200_000 }),)


        const globalStateAta = await getAssociatedTokenAddress(mintaddress, globalState, true)

        console.log("globalStateAta:", globalStateAta.toBase58())
        console.log(await connection.getAccountInfo(globalStateAta), "`````````~~~~~~~~~")
        if (await connection.getAccountInfo(adminAta) == null) {
            console.log("User lock lp token for a first time")
            withdrawTx.add(createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                adminAta,
                wallet.publicKey,
                mintaddress
            ))
        }

        console.log("adminAta", adminAta, adminAta.toBase58())
        console.log("globalStateAta", globalStateAta, globalStateAta.toBase58())


        const _amount = new BN(amount).mul(new BN(10 ** 8))
        const instruction = await program.methods.withdraw(_amount).accounts({
            globalState,
            mint: mintaddress,
            admin: wallet.publicKey,
            globalStateTokenAccount: globalStateAta,
            adminTokenAccount: adminAta,
            tokenProgram: TOKEN_PROGRAM_ID,

        }).instruction()
        withdrawTx.add(instruction)
        console.log("🚀 ~ transaction:", withdrawTx)

        try {
            withdrawTx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
            withdrawTx.feePayer = wallet.publicKey
            console.log(await connection.simulateTransaction(withdrawTx))
            if (wallet.signTransaction) {
                const signedTx = await wallet.signTransaction(withdrawTx)
                const sTx = signedTx.serialize()
                const signature = await connection.sendRawTransaction(sTx, { skipPreflight: true })

                const blockhash = await connection.getLatestBlockhash()
                await connection.confirmTransaction({
                    signature,
                    blockhash: blockhash.blockhash,
                    lastValidBlockHeight: blockhash.lastValidBlockHeight
                }, "confirmed");
                console.log("Successfully initialized.\n Signature: ", signature);
            }
        } catch (error) {
            console.log("Error in lock transaction", error)
        }

    } catch (error) {
        console.log("Error in making initialize transaction", error)
        return
    }
}