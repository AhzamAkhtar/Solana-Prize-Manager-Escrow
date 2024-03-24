mod state;
mod contexts;

pub use state::*;
pub use contexts::*;

use anchor_lang::prelude::*;

declare_id!("EamyjF7GPGssck4ErdB3zvJm3fQL52k9uivMRcRqN417");

#[program]
pub mod prizemanager {
    use super::*;

    pub fn initialize(
        ctx: Context<InitializePrize>,
        seed: u64,
        authority: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.init(&ctx.bumps, seed, authority)
    }

    pub fn put_prize_on_vault(
        ctx: Context<PutPrizeOnVault>,
    ) -> Result<()> {
        ctx.accounts.put_prize_on_vault()
    }

    pub fn give_prize_back_to_vault(
        ctx: Context<GivePrizeBackToAdmin>,
    ) -> Result<()> {
        ctx.accounts.give_prize_back_to_admin()
    }

    pub fn claim_prize(
        ctx: Context<ClaimPrize>,
    ) -> Result<()> {
        ctx.accounts.claim_prize()
    }

}

