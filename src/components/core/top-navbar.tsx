import { ModeToggle } from './mode-toggle';

export function TopNavbar() {
    return (
        <div className="text-accent-foreground w-full flex justify-between items-center px-2 py-1 fixed top-0">
            <p className="mt-3">No BS, Editor</p>
            <ModeToggle />
        </div>
    );
}
