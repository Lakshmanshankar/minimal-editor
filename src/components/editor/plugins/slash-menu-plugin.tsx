import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $getSelection,
    $isRangeSelection,
    $isElementNode,
    $createTextNode,
    $isRootNode,
    INSERT_PARAGRAPH_COMMAND,
} from 'lexical';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_CHECK_LIST_COMMAND,
} from '@lexical/list';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { mergeRegister } from '@lexical/utils';
import { Input } from '@/components/ui/input';

type SlashMenuItem = {
    value: string;
    label: string;
    shortcut: string;
    command: (editor: ReturnType<typeof useLexicalComposerContext>[0]) => void;
    isLastInGroup?: boolean;
};

const insertHeading = (
    editor: ReturnType<typeof useLexicalComposerContext>[0],
    heading: 'h1' | 'h2' | 'h3'
) => {
    editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            const element = $isElementNode(node) ? node : node.getParent();
            if (element && !$isRootNode(element)) {
                const newHeading = $createHeadingNode(heading);
                const textContent = element.getTextContent();
                if (textContent) {
                    newHeading.append($createTextNode(textContent));
                }
                element.replace(newHeading);
                newHeading.selectEnd();
            }
        }
    });
};

const menuItems: SlashMenuItem[] = [
    {
        value: 'paragraph',
        label: 'Text',
        shortcut: '',
        command: editor => {
            editor.dispatchCommand(INSERT_PARAGRAPH_COMMAND, undefined);
        },
        isLastInGroup: true,
    },
    {
        value: 'h1',
        label: 'Heading 1',
        shortcut: '#',
        command: editor => {
            insertHeading(editor, 'h1');
        },
    },
    {
        value: 'h2',
        label: 'Heading 2',
        shortcut: '##',
        command: editor => {
            insertHeading(editor, 'h2');
        },
    },
    {
        value: 'h3',
        label: 'Heading 3',
        shortcut: '###',
        command: editor => {
            insertHeading(editor, 'h3');
        },
        isLastInGroup: true,
    },
    {
        value: 'ul',
        label: 'Bulleted List',
        shortcut: '-',
        command: editor => {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        },
    },
    {
        value: 'ol',
        label: 'Numbered List',
        shortcut: '1.',
        command: editor => {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        },
    },
    {
        value: 'checklist',
        label: 'Checklist',
        shortcut: '[]',
        command: editor => {
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        },
        isLastInGroup: true,
    },
    {
        value: 'quote',
        label: 'Quote',
        shortcut: '>',
        command: editor => {
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    const element = $isElementNode(node)
                        ? node
                        : node.getParent();
                    if (element && !$isRootNode(element)) {
                        const newQuote = $createQuoteNode();
                        const textContent = element.getTextContent();
                        if (textContent) {
                            newQuote.append($createTextNode(textContent));
                        }
                        element.replace(newQuote);
                        newQuote.selectEnd();
                    }
                }
            });
        },
    },
    {
        value: 'hr',
        label: 'Horizontal Rule',
        shortcut: '---',
        command: editor => {
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
        },
    },
];

export function SlashMenuPlugin() {
    const [editor] = useLexicalComposerContext();
    const ref = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [show, setShow] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const filteredItems = menuItems.filter(item =>
        item.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelect = useCallback(
        (item: SlashMenuItem) => {
            // Remove the slash before executing the command
            editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    if (!$isElementNode(node)) {
                        const content = node.getTextContent();
                        // Remove the slash character
                        if (content.startsWith('/')) {
                            node.setTextContent(content.slice(1));
                            // Move cursor to the beginning
                            node.select(0, 0);
                        }
                    }
                }
            });

            // Execute the command
            item.command(editor);

            setIsVisible(false);
            setTimeout(() => {
                setShow(false);
                setSearchValue('');
                setSelectedIndex(0);
            }, 150); // Wait for animation to complete
        },
        [editor]
    );

    const updateMenu = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && selection.isCollapsed()) {
            const node = selection.anchor.getNode();
            if ($isElementNode(node)) return;

            const textContent = node.getTextContent();
            const cursorOffset = selection.anchor.offset;

            // Only show menu if slash is at the beginning of the block
            // Check if the text before cursor is just "/" or starts with "/"
            const textBeforeCursor = textContent.slice(0, cursorOffset);
            const slashMatch = textBeforeCursor.match(/^\/$/);

            if (slashMatch) {
                setShow(true);
                setSearchValue('');
                setSelectedIndex(0);

                // Position the menu based on current cursor position
                setTimeout(() => {
                    const domSelection = window.getSelection();
                    if (
                        domSelection &&
                        domSelection.rangeCount > 0 &&
                        ref.current
                    ) {
                        try {
                            const domRange = domSelection.getRangeAt(0);
                            const rect = domRange.getBoundingClientRect();

                            ref.current.style.top = `${rect.bottom + window.scrollY + 5}px`;
                            ref.current.style.left = `${rect.left + window.scrollX}px`;
                        } catch (error) {
                            console.warn(
                                'Failed to get cursor position:',
                                error
                            );
                        }
                    }

                    // Trigger animation
                    setIsVisible(true);
                }, 0);
            } else {
                setIsVisible(false);
                setTimeout(() => {
                    setShow(false);
                    setSearchValue('');
                    setSelectedIndex(0);
                }, 150); // Wait for animation to complete
            }
        } else {
            setIsVisible(false);
            setTimeout(() => {
                setShow(false);
                setSearchValue('');
                setSelectedIndex(0);
            }, 150); // Wait for animation to complete
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateMenu();
                });
            })
        );
    }, [editor, updateMenu]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!show) return;

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredItems.length);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(
                    prev =>
                        (prev - 1 + filteredItems.length) % filteredItems.length
                );
            } else if (event.key === 'Enter') {
                event.preventDefault();
                if (filteredItems[selectedIndex]) {
                    handleSelect(filteredItems[selectedIndex]);
                }
            } else if (event.key === 'Escape') {
                event.preventDefault();
                setIsVisible(false);
                setTimeout(() => {
                    setShow(false);
                    setSearchValue('');
                    setSelectedIndex(0);
                }, 150); // Wait for animation to complete
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [show, filteredItems, selectedIndex, handleSelect, editor]);

    return show
        ? createPortal(
              <div
                  ref={ref}
                  className={`absolute z-50 w-72 rounded-md border border-accent bg-popover p-0 text-popover-foreground shadow-lg font-sans transition-all duration-150 ease-out ${
                      isVisible
                          ? 'opacity-100 scale-100 translate-y-0'
                          : 'opacity-0 scale-95 -translate-y-1'
                  }`}
              >
                  <div className="p-2 border-b border-accent/20">
                      <Input
                          ref={inputRef}
                          type="text"
                          placeholder="Search commands..."
                          value={searchValue}
                          onChange={e => setSearchValue(e.target.value)}
                          className="h-8 border-0 bg-transparent px-0 py-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-sans"
                      />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto py-1 px-1">
                      {filteredItems.length === 0 ? (
                          <div className="p-2 text-sm text-center text-muted-foreground">
                              No commands found.
                          </div>
                      ) : (
                          filteredItems.map((item, index) => (
                              <div
                                  key={item.value}
                                  onClick={() => handleSelect(item)}
                                  className={`relative 
                                rounded-sm text-size-small
                            flex cursor-default select-none items-center justify-between px-2 py-1 outline-none transition-colors ${
                                index === selectedIndex
                                    ? 'bg-accent text-accent-foreground'
                                    : ''
                            } ${item.isLastInGroup && !searchValue ? 'border-b border-primary/10 mb-1 pb-2' : ''}`}
                              >
                                  <span className="font-medium ">
                                      {item.label}
                                  </span>
                                  {item.shortcut && (
                                      <span className="font-mono">
                                          {item.shortcut}
                                      </span>
                                  )}
                              </div>
                          ))
                      )}
                  </div>
              </div>,
              document.body
          )
        : null;
}
