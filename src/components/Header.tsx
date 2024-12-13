import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, setSearchQuery }) => (
  <>
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4">
                <ul className="space-y-2">
                  <li><Button variant="ghost" className="w-full justify-start">Home</Button></li>
                  <li><Button variant="ghost" className="w-full justify-start">Sell Item</Button></li>
                  <li><Button variant="ghost" className="w-full justify-start">My Account</Button></li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold">PushNshop</h1>

          <Button variant="ghost" size="icon" className="lg:hidden">
            <Search size={24} />
          </Button>

          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost">Sell Item</Button>
            <Button variant="ghost">My Account</Button>
          </nav>
        </div>
      </div>
    </header>

    <div className="lg:hidden p-4 bg-white border-b">
      <div className="relative">
        <Input
          type="search"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-4 pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
      </div>
    </div>
  </>
);