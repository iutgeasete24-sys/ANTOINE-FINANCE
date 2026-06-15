import { SearchDropdown } from "./SearchDropdown";

interface TickerSearchProps {
  compact?: boolean;
}

export function TickerSearch({ compact = false }: TickerSearchProps) {
  return <SearchDropdown compact={compact} />;
}
