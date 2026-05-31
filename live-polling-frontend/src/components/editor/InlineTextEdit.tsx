import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TipTapLink from "@tiptap/extension-link";
import FontFamily from "@tiptap/extension-font-family";
import { FontSize } from "./extensions/FontSize";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Highlighter,
  Baseline,
  Eraser,
  List,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function InlineTextEdit({
  text,
  onUpdate,
  className,
  style,
  isEditable,
  placeholder,
  multiline = true,
}: {
  text: string;
  onUpdate: (newText: string) => void;
  className?: string;
  style?: React.CSSProperties;
  isEditable: boolean;
  placeholder?: string;
  multiline?: boolean;
}) {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          heading: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
          dropcursor: false,
        }),
        Underline,
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Placeholder.configure({
          placeholder: isEditable ? (placeholder || "Type something...") : "",
          emptyEditorClass: "is-editor-empty",
        }),
        TextStyle,
        Color,
        Highlight.configure({
          multicolor: true,
        }),
        TipTapLink.configure({
          openOnClick: false,
        }),
        FontFamily,
        FontSize,
      ],
      content: text,
      editable: isEditable,
      onBlur: ({ editor }) => {
        let html = editor.getHTML();
        if (html === "<p></p>") html = "";
        if (html !== text) {
          onUpdate(html);
        }
      },
      editorProps: {
        attributes: {
          class: cn(
            "outline-none cursor-text transition-colors break-words text-inherit",
          ),
        },
        handleKeyDown: (view, event) => {
          if (!multiline && event.key === "Enter") {
            event.preventDefault();
            (view.dom as HTMLElement).blur();
            return true;
          }
          return false;
        },
      },
    },
    [isEditable]
  );

  useEffect(() => {
    if (editor && editor.isEditable !== isEditable) {
      editor.setEditable(isEditable);
    }
  }, [editor, isEditable]);

  useEffect(() => {
    if (editor && !editor.isFocused && text !== editor.getHTML()) {
      editor.commands.setContent(text);
    }
  }, [editor, text]);

  if (!editor) {
    return null;
  }

  return (
    <>
      {editor && isEditable && (
        <BubbleMenu
          editor={editor}
          className="flex items-center flex-wrap bg-popover text-popover-foreground shadow-md border rounded-md p-1 gap-1 max-w-sm sm:max-w-max"
        >
          <div className="flex items-center gap-0.5">
            <select
              className="h-8 bg-transparent text-sm border-0 focus:ring-0 cursor-pointer px-1 outline-none appearance-none"
              value={editor.getAttributes("textStyle").fontFamily || ""}
              onChange={(e) => {
                if (e.target.value) {
                  editor.chain().focus().setFontFamily(e.target.value).run();
                } else {
                  editor.chain().focus().unsetFontFamily().run();
                }
              }}
              title="Font Family"
            >
              <option value="">Font</option>
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times</option>
              <option value="Courier New">Courier</option>
              <option value="Georgia">Georgia</option>
            </select>

            <select
              className="h-8 bg-transparent text-sm border-0 focus:ring-0 cursor-pointer px-1 outline-none appearance-none"
              value={
                editor.getAttributes("textStyle").fontSize?.replace("px", "") ||
                ""
              }
              onChange={(e) => {
                if (e.target.value) {
                  editor
                    .chain()
                    .focus()
                    .setFontSize(`${e.target.value}px`)
                    .run();
                } else {
                  editor.chain().focus().unsetFontSize().run();
                }
              }}
              title="Font Size"
            >
              <option value="">Size</option>
              <option value="12">12</option>
              <option value="14">14</option>
              <option value="16">16</option>
              <option value="18">18</option>
              <option value="20">20</option>
              <option value="24">24</option>
              <option value="32">32</option>
              <option value="48">48</option>
              <option value="64">64</option>
            </select>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              aria-label="Toggle bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bold") && "bg-muted"
              )}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Toggle italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("italic") && "bg-muted"
              )}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Toggle underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("underline") && "bg-muted"
              )}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Toggle strikethrough"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("strike") && "bg-muted"
              )}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <label
              className="cursor-pointer relative flex h-8 w-8 items-center justify-center hover:bg-muted rounded-md text-muted-foreground"
              title="Highlight Color"
            >
              <Highlighter className="h-4 w-4" />
              <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onInput={(e) =>
                  editor
                    .chain()
                    .focus()
                    .setHighlight({ color: e.currentTarget.value })
                    .run()
                }
                value={editor.getAttributes("highlight").color || "#ffff00"}
              />
            </label>
            <label
              className="cursor-pointer relative flex h-8 w-8 items-center justify-center hover:bg-muted rounded-md text-muted-foreground"
              title="Text Color"
            >
              <Baseline className="h-4 w-4" />
              <input
                type="color"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                onInput={(e) =>
                  editor.chain().focus().setColor(e.currentTarget.value).run()
                }
                value={editor.getAttributes("textStyle").color || "#000000"}
              />
            </label>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              aria-label="Toggle link"
              onClick={() => {
                if (editor.isActive("link")) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  const url = window.prompt("Enter link URL");
                  if (url) {
                    editor.chain().focus().setLink({ href: url }).run();
                  }
                }
              }}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("link") && "bg-muted"
              )}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              aria-label="Bullet List"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("bulletList") && "bg-muted"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              aria-label="Ordered List"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive("orderedList") && "bg-muted"
              )}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "left" }) && "bg-muted"
              )}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "center" }) && "bg-muted"
              )}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={cn(
                "h-8 w-8 p-0",
                editor.isActive({ textAlign: "right" }) && "bg-muted"
              )}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              aria-label="Clear formatting"
              onClick={() =>
                editor.chain().focus().clearNodes().unsetAllMarks().run()
              }
              className="h-8 w-8 p-0"
              title="Clear Formatting"
            >
              <Eraser className="h-4 w-4" />
            </Button>
          </div>
        </BubbleMenu>
      )}
      <div
        className={cn(
          className,
          isEditable &&
            "hover:ring-1 hover:ring-primary/20 focus-within:ring-2 focus-within:ring-primary/50 rounded min-w-[20px] inline-block relative"
        )}
        style={style}
      >
        <EditorContent editor={editor} className="h-full w-full outline-none" />
      </div>
    </>
  );
}
