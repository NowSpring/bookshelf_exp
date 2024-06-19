import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchComponentProps {
  onSearch: (searchTerm1: string, searchTerm2: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  const [searchTerm1, setSearchTerm1] = useState('');
  const [searchTerm2, setSearchTerm2] = useState('');

  const handleSearchChange1 = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm1(e.target.value);
  };

  const handleSearchChange2 = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm2(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm1, searchTerm2);
  };

  return (
      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '10px' }}>
        <div className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="本①を検索"
            className="w-6/12"
            onChange={handleSearchChange1}
            value={searchTerm1}
          />
          <Input
            type="text"
            placeholder="本②を検索"
            className="w-6/12"
            onChange={handleSearchChange2}
            value={searchTerm2}
          />
          <Button size="icon" className="rounded-md" type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
  );
};

export default SearchComponent;