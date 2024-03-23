mod state;
mod contexts;

pub use state::*;
pub use contexts::*;

use anchor_lang::prelude::*;

declare_id!("QVe7gDtiEyrdVpak9xkM2vfCiW1riBme6M2Z1MK7RTU");

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
}

