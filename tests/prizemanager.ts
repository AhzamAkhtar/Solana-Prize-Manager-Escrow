import * as anchor from "@coral-xyz/anchor";
import {BN} from "@coral-xyz/anchor"
import {Program} from "@coral-xyz/anchor";
import {Prizemanager, IDL} from "../target/types/prizemanager"
//import { ConstantProduct, LiquidityPair } from "constant-product-curve-wasm";
import {PublicKey, Commitment, Keypair, SystemProgram} from "@solana/web3.js"
import {
    ASSOCIATED_TOKEN_PROGRAM_ID as associatedTokenProgram,
    TOKEN_PROGRAM_ID as tokenProgram,
    createMint,
    createAccount,
    mintTo,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
} from "@solana/spl-token"
import {randomBytes} from "crypto"
import {assert} from "chai"
import * as bs58 from "bs58";
import {ASSOCIATED_PROGRAM_ID} from "@coral-xyz/anchor/dist/cjs/utils/token";
import {wallet, wallet_two, wallet_three} from "../wallet/wallet"
import {min} from "bn.js";

const commitment: Commitment = "confirmed"; // processed, confirmed, finalized

describe("prize-manager", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const programId = new PublicKey("QVe7gDtiEyrdVpak9xkM2vfCiW1riBme6M2Z1MK7RTU");
    const program = new anchor.Program<Prizemanager>(IDL, programId, anchor.getProvider());

    // Set up our keys
    const initializer = Keypair.fromSecretKey(bs58.decode(wallet));
    const initializer2 = Keypair.fromSecretKey(bs58.decode(wallet_two))
    const gamer_vault = Keypair.fromSecretKey(bs58.decode(wallet_three))

    // Random seed
    const seed = new BN(randomBytes(8));

    // PDAs
    const auth = PublicKey.findProgramAddressSync([Buffer.from("auth")], program.programId)[0];
    const new_auth = PublicKey.findProgramAddressSync([Buffer.from("new_auth")], program.programId)[0];
    const prize_auth = PublicKey.findProgramAddressSync([Buffer.from("prize_auth")], program.programId)[0];
    const config = PublicKey.findProgramAddressSync([Buffer.from("config"), seed.toBuffer().reverse()], program.programId)[0];
    const lp_config = PublicKey.findProgramAddressSync([Buffer.from("lp_config"), seed.toBuffer().reverse()], program.programId)[0];
    const prize_config = PublicKey.findProgramAddressSync([Buffer.from("prize"), seed.toBuffer().reverse()], program.programId)[0];

    // Mints
    let mint_x: PublicKey;
    let mint_lp = PublicKey.findProgramAddressSync([Buffer.from("lp"), config.toBuffer()], program.programId)[0];
    let prize_one_mint: PublicKey;

    // ATAs
    let initializer_x_ata: PublicKey;
    let initializer_lp_ata: PublicKey;
    let gamer_game_lp_ata: PublicKey;
    let gamer_x_ata: PublicKey;
    let vault_x_ata: PublicKey;
    let vault_y_ata: PublicKey;
    let vault_lp_ata: PublicKey;

    let particular_prize_vault: PublicKey;

    xit("Airdrop", async () => {
        await Promise.all([initializer, initializer2, gamer_vault].map(async (k) => {
            return await anchor.getProvider().connection.requestAirdrop(k.publicKey, 100 * anchor.web3.LAMPORTS_PER_SOL)
        })).then(confirmTxs);
    });

    it("Create mints, tokens and ATAs", async () => {
        // Create mints and ATAs
        // let [u1] = await Promise.all([initializer, initializer2].map(async (a) => {
        //     return await newMintToAta(anchor.getProvider().connection, a)
        // }))
        //mint_x = new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr")
        prize_one_mint = new PublicKey("BjwKL4x9TjoBgzkgBW14bzn1ocu7HX8up63qXG9AFWE9")
        //initializer_x_ata = await getAssociatedTokenAddress(mint_x, initializer.publicKey, false, tokenProgram)
        //initializer_lp_ata = await getAssociatedTokenAddress(mint_lp, initializer.publicKey, false, tokenProgram);
        //gamer_game_lp_ata = await getAssociatedTokenAddress(mint_lp, gamer_vault.publicKey, false, tokenProgram);
        //gamer_x_ata = await getAssociatedTokenAddress(mint_x, gamer_vault.publicKey, false, tokenProgram);
        // Create take ATAs
        //vault_x_ata = await getAssociatedTokenAddress(mint_x, auth, true, tokenProgram);
        //vault_y_ata = await getAssociatedTokenAddress(mint_x, new_auth, true, tokenProgram);
        //vault_lp_ata = await getAssociatedTokenAddress(mint_lp, auth, true, tokenProgram);

        particular_prize_vault = await getAssociatedTokenAddress(prize_one_mint, prize_auth, true, tokenProgram);
        console.log(particular_prize_vault.toBase58())
    })

    it("Initialize", async () => {
        try {
            const tx = await program.methods.initialize(
                seed,
                initializer.publicKey
            ).accounts({
                user: initializer.publicKey,
                prizeAuth: prize_auth,
                prizeMint: prize_one_mint,
                particularPrizeVault: particular_prize_vault,
                prizeConfig: prize_config,
                tokenProgram: TOKEN_PROGRAM_ID,
                associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
                systemProgram: SystemProgram.programId
            })
                .signers([initializer])
                .rpc()
            await confirmTx(tx)
            console.log("Your transaction signature", tx);
        } catch (e) {
            console.error(e);
        }
    });

// Helpers
    const confirmTx = async (signature: string) => {
        const latestBlockhash = await anchor.getProvider().connection.getLatestBlockhash();
        await anchor.getProvider().connection.confirmTransaction(
            {
                signature,
                ...latestBlockhash,
            },
            commitment
        )
    }

    const confirmTxs = async (signatures: string[]) => {
        await Promise.all(signatures.map(confirmTx))
    }

    const newMintToAta = async (connection, minter: Keypair): Promise<{ mint: PublicKey, ata: PublicKey }> => {
        const mint = await createMint(connection, minter, minter.publicKey, null, 6)
        // await getAccount(connection, mint, commitment)
        const ata = await createAccount(connection, minter, mint, minter.publicKey)
        const signature = await mintTo(connection, minter, mint, ata, minter, 21e8)
        await confirmTx(signature)
        return {
            mint,
            ata
        }
    }
})