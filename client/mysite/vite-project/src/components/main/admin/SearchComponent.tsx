import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchComponentProps {
  onSearch: (searchTerm: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
      <div className="flex w-full items-center space-x-2">
        <Input
          type="text"
          placeholder="本のタイトルを検索"
          className="Search"
          onChange={handleSearchChange}
          value={searchTerm}
        />
        <Button size="icon" className="rounded-md" type="submit">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default SearchComponent;
