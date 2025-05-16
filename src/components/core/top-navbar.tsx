import { ModeToggle } from './mode-toggle';

export function TopNavbar() {
    return (
        <div className="bg-accent text-accent-foreground w-full flex justify-between items-center px-2 py-1">
            <p>Top Navbar</p>
            <ModeToggle />
        </div>
    );
}
