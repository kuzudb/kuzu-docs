const kuzuDark = {
  name: "Kuzu Dark",
  type: "dark",
  colors: {
    background: "#1a1a1a",
    foreground: "#d4d4d4",
  },
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        fontStyle: "italic",
        foreground: "#6A9955"
      }
    },
    {
      name: "Keyword",
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: {
        foreground: "#dc6428"
      }
    },
    {
      name: "String",
      scope: ["string", "string.quoted"],
      settings: {
        foreground: "#e74c3c"
      }
    },
    {
      name: "Number",
      scope: ["constant.numeric"],
      settings: {
        foreground: "#f1c40f"
      }
    },
    {
      name: "Function",
      scope: ["entity.name.function", "support.function"],
      settings: {
        foreground: "#f39c12"
      }
    },
    {
      name: "Variable",
      scope: ["variable", "variable.other"],
      settings: {
        foreground: "#9CDCFE"
      }
    },
    {
      name: "Type",
      scope: ["entity.name.type", "support.type"],
      settings: {
        foreground: "#d35400"
      }
    },
    {
      name: "Operator",
      scope: ["keyword.operator"],
      settings: {
        foreground: "#D4D4D4"
      }
    },
    {
      name: "Punctuation",
      scope: ["punctuation"],
      settings: {
        foreground: "#D4D4D4"
      }
    }
  ]
};

const kuzuLight = {
  name: "Kuzu Light",
  type: "light",
  colors: {
    background: "#f8f8f8",
    foreground: "#2d2d2d",
  },
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment", "punctuation.definition.comment"],
      settings: {
        fontStyle: "italic",
        foreground: "#6A9955"
      }
    },
    {
      name: "Keyword",
      scope: ["keyword", "storage.type", "storage.modifier"],
      settings: {
        foreground: "#dc6428"
      }
    },
    {
      name: "String",
      scope: ["string", "string.quoted"],
      settings: {
        foreground: "#8b0000"
      }
    },
    {
      name: "Number",
      scope: ["constant.numeric"],
      settings: {
        foreground: "#b8860b"
      }
    },
    {
      name: "Function",
      scope: ["entity.name.function", "support.function"],
      settings: {
        foreground: "#ff4500"
      }
    },
    {
      name: "Variable",
      scope: ["variable", "variable.other"],
      settings: {
        foreground: "#000080"
      }
    },
    {
      name: "Type",
      scope: ["entity.name.type", "support.type"],
      settings: {
        foreground: "#8b4513"
      }
    },
    {
      name: "Operator",
      scope: ["keyword.operator"],
      settings: {
        foreground: "#000000"
      }
    },
    {
      name: "Punctuation",
      scope: ["punctuation"],
      settings: {
        foreground: "#000000"
      }
    }
  ]
};

export { kuzuDark, kuzuLight }; 