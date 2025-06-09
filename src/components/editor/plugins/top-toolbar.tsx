import {
    $getSelection,
    $isRangeSelection,
    FORMAT_TEXT_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LinkEditorPlugin } from './link-editor-plugin';
import { mergeRegister } from '@lexical/utils';
import { createPortal } from 'react-dom';
import { Code, Bold, Italic, Underline } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const ref = useRef<HTMLDivElement>(null);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isCode, setIsCode] = useState(false);
    const [show, setShow] = useState(false);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
            setShow(true);
            const domSelection = window.getSelection();
            if (domSelection) {
                const domRange = domSelection.getRangeAt(0);
                const rect = domRange.getBoundingClientRect();
                if (ref.current) {
                    ref.current.style.opacity = '1';
                    ref.current.style.top = `${rect.top + window.scrollY - 40}px`;
                    ref.current.style.left = `${rect.left + window.scrollX - ref.current.offsetWidth / 2 + rect.width / 2}px`;
                }
            }
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsCode(selection.hasFormat('code'));
        } else {
            setShow(false);
            if (ref.current) {
                ref.current.style.opacity = '0';
            }
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => {
                editorState.read(() => {
                    updateToolbar();
                });
            }),
            editor.registerCommand(
                FORMAT_TEXT_COMMAND,
                () => {
                    updateToolbar();
                    return false;
                },
                COMMAND_PRIORITY_CRITICAL
            )
        );
    }, [editor, updateToolbar]);

    const format = (type: 'bold' | 'italic' | 'underline' | 'code') => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };

    return show
        ? createPortal(
              <div
                  ref={ref}
                  className="absolute z-50 transition-opacity opacity-0 flex items-center gap-1 border border-gray-200 dark:border-accent rounded-lg bg-background p-1 shadow-lg"
              >
                  <Button
                      variant="ghost"
                      onClick={() => format('bold')}
                      className={cn('h-8 w-8 p-0', {
                          'bg-primary text-primary-foreground': isBold,
                      })}
                  >
                      <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="ghost"
                      onClick={() => format('italic')}
                      className={cn('h-8 w-8 p-0', {
                          'bg-primary text-primary-foreground': isItalic,
                      })}
                  >
                      <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="ghost"
                      onClick={() => format('underline')}
                      className={cn('h-8 w-8 p-0', {
                          'bg-primary text-primary-foreground': isUnderline,
                      })}
                  >
                      <Underline className="h-4 w-4" />
                  </Button>
                  <Button
                      variant="ghost"
                      onClick={() => format('code')}
                      className={cn('h-8 w-8 p-0', {
                          'bg-primary text-primary-foreground': isCode,
                      })}
                  >
                      <Code className="h-4 w-4" />
                  </Button>
                  <LinkEditorPlugin />
              </div>,
              document.body
          )
        : null;
}
