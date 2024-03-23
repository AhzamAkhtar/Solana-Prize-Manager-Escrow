mod state;
mod contexts;

pub use state::*;
pub use contexts::*;

use anchor_lang::prelude::*;

declare_id!("7iA4wp9pCEEHR3nxCxXdQSrxruqBwFUbMMYdSE9gRuSj");

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

}

