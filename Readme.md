# Prize-Manager Escrow Program

Welcome to the Prize-Manager Escrow Program, a Solana-based smart contract designed to securely manage and handle prize distribution. This program allows for the initialization of prize vaults, claiming of prizes by eligible users, and the ability to return prizes to the vault by authorized admins. Below you'll find an overview of the core functionalities provided by the program.

## Features

### 1. Initialize Prize Vault
- **Description**: This function allows the creation and initialization of a prize vault. A prize vault securely stores a specific prize and designates users who are eligible to claim it.
- **Functionality**:
    - Initializes a vault with a specific prize.
    - Configures eligibility criteria for users to claim the prize.
    - Ensures that the prize is securely stored in the vault until claimed.

### 2. Claim Prize
- **Description**: This function allows eligible users to claim a prize from the vault. When a prize is claimed, it is deducted from the vault, and the user's prize tickets are also decremented accordingly.
- **Functionality**:
    - Checks if the user is eligible to claim the prize.
    - Deducts the prize from the vault.
    - Updates the user's prize ticket balance to reflect the claim.

### 3. Put Prize Back in Vault
- **Description**: This function allows the return of a particular prize to the vault. Only users with admin roles are authorized to perform this action, ensuring secure management of the prize vault.
- **Functionality**:
    - Returns a specific prize to the vault.
    - Restricts this action to users with admin roles to maintain security and integrity.
