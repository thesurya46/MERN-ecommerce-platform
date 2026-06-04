import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '../app/components/ui/input';
import { Button } from '../app/components/ui/button';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form onSubmit={handleSearch} className="hidden md:flex items-center relative flex-1 max-w-md mx-4">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9 pr-20 h-9 bg-muted/50"
      />
      <Button type="submit" size="sm" variant="ghost" className="absolute right-1 h-7 text-xs">
        Search
      </Button>
    </form>
  );
}
