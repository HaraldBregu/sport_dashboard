//Section.ts

import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import NodeView from "./node-view";

export interface SectionOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    section: {
      /**
       * Create a new section
       */
      setSection: () => ReturnType;
      /**
       * Remove a section
       */
      unsetSection: () => ReturnType;
    };
  }
}

export const Section = Node.create<SectionOptions>({
  name: "section",

  group: "block",

  content: "block", // Changed from block+ to block

  draggable: true,

  inline: false,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="section"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": "section",
        "data-contextmenu": "true", // Add this to ensure context menu works
      }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(NodeView);
  },

  addCommands() {
    return {
      setSection:
        () =>
        ({ commands }) => {
          return commands.wrapIn(this.name);
        },
      unsetSection:
        () =>
        ({ commands }) => {
          return commands.lift(this.name);
        },
    };
  },

  // Add handleContextMenu to ensure context menu events work
  handleContextMenu: false,
});

