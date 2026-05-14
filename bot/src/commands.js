const OptionType = {
  STRING: 3,
  INTEGER: 4
};

export const commandDefinitions = [
  {
    name: "verify",
    description: "Verify a Solana wallet and apply the UAS holder role.",
    options: [
      {
        name: "wallet",
        description: "Solana wallet address to verify.",
        type: OptionType.STRING,
        required: true
      }
    ]
  },
  {
    name: "refresh-role",
    description: "Re-check holder status and refresh the gated Discord role.",
    options: [
      {
        name: "wallet",
        description: "Solana wallet address to re-check.",
        type: OptionType.STRING,
        required: true
      }
    ]
  },
  {
    name: "floor",
    description: "Show the current configured marketplace floor snapshot."
  },
  {
    name: "dashboard",
    description: "Get the UAS v2 dashboard link."
  },
  {
    name: "ape",
    description: "Generate a UAS v2 ape art prompt.",
    options: [
      {
        name: "mood",
        description: "Ape attitude or expression.",
        type: OptionType.STRING,
        required: false
      },
      {
        name: "trait_bias",
        description: "Trait direction to bias the prompt toward.",
        type: OptionType.STRING,
        required: false
      },
      {
        name: "wallet",
        description: "Optional wallet seed for repeatable output.",
        type: OptionType.STRING,
        required: false
      }
    ]
  },
  {
    name: "mutate",
    description: "Generate a SerumX mutation concept.",
    options: [
      {
        name: "serum",
        description: "Serum label.",
        type: OptionType.STRING,
        required: false
      },
      {
        name: "intensity",
        description: "Mutation intensity.",
        type: OptionType.STRING,
        required: false
      },
      {
        name: "wallet",
        description: "Optional wallet seed for repeatable output.",
        type: OptionType.STRING,
        required: false
      }
    ]
  },
  {
    name: "stake",
    description: "Preview a non-custodial staking intent for an ape.",
    options: [
      {
        name: "ape_id",
        description: "Ape mint, token id, or nickname.",
        type: OptionType.STRING,
        required: true
      },
      {
        name: "days",
        description: "Number of days to preview.",
        type: OptionType.INTEGER,
        min_value: 1,
        max_value: 365,
        required: false
      }
    ]
  },
  {
    name: "xp",
    description: "Show your UAS v2 community XP preview."
  },
  {
    name: "alert",
    description: "Create an educational market watch note.",
    options: [
      {
        name: "scenario",
        description: "What market setup should the note watch?",
        type: OptionType.STRING,
        required: true
      },
      {
        name: "max_sol",
        description: "Optional SOL price ceiling for the watch note.",
        type: OptionType.INTEGER,
        min_value: 1,
        max_value: 10000,
        required: false
      }
    ]
  }
];
