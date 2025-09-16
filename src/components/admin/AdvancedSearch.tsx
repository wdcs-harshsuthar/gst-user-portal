import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import { 
  Search, 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  SlidersHorizontal,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { LIBERIAN_COUNTIES } from '../shared/constants';

export interface SearchFilters {
  query: string;
  status: string[];
  type: string[];
  county: string[];
  dateRange: {
    from?: Date;
    to?: Date;
  };
  assignedTo: string[];
  priority: string[];
  amount: {
    min?: number;
    max?: number;
  };
  customFields: Record<string, any>;
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onExport: (filters: SearchFilters) => void;
  onReset: () => void;
  loading?: boolean;
  resultCount?: number;
  className?: string;
}

const defaultFilters: SearchFilters = {
  query: '',
  status: [],
  type: [],
  county: [],
  dateRange: {},
  assignedTo: [],
  priority: [],
  amount: {},
  customFields: {}
};

const statusOptions = [
  { value: 'pending', label: 'Pending', count: 45 },
  { value: 'under-review', label: 'Under Review', count: 32 },
  { value: 'approved', label: 'Approved', count: 180 },
  { value: 'rejected', label: 'Rejected', count: 12 },
  { value: 'payment-pending', label: 'Payment Pending', count: 28 }
];

const typeOptions = [
  { value: 'individual', label: 'Individual', count: 120 },
  { value: 'business', label: 'Business', count: 95 },
  { value: 'sole-proprietorship', label: 'Sole Proprietorship', count: 65 },
  { value: 'branch', label: 'Branch Registration', count: 17 }
];

const assigneeOptions = [
  { value: 'jane.smith', label: 'Jane Smith' },
  { value: 'john.doe', label: 'John Doe' },
  { value: 'mary.johnson', label: 'Mary Johnson' },
  { value: 'unassigned', label: 'Unassigned' }
];

const priorityOptions = [
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' }
];

export default function AdvancedSearch({
  onSearch,
  onExport,
  onReset,
  loading = false,
  resultCount,
  className
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateArrayFilter = useCallback((
    key: keyof Pick<SearchFilters, 'status' | 'type' | 'county' | 'assignedTo' | 'priority'>,
    value: string,
    checked: boolean
  ) => {
    setFilters(prev => ({
      ...prev,
      [key]: checked 
        ? [...prev[key], value]
        : prev[key].filter(item => item !== value)
    }));
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.query !== '' ||
      filters.status.length > 0 ||
      filters.type.length > 0 ||
      filters.county.length > 0 ||
      filters.assignedTo.length > 0 ||
      filters.priority.length > 0 ||
      filters.dateRange.from ||
      filters.dateRange.to ||
      filters.amount.min !== undefined ||
      filters.amount.max !== undefined
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.query) count++;
    count += filters.status.length;
    count += filters.type.length;
    count += filters.county.length;
    count += filters.assignedTo.length;
    count += filters.priority.length;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.amount.min !== undefined || filters.amount.max !== undefined) count++;
    return count;
  }, [filters]);

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onReset();
  };

  const handleExport = () => {
    onExport(filters);
  };

  const formatDateRange = () => {
    if (!filters.dateRange.from && !filters.dateRange.to) return 'Select date range';
    if (filters.dateRange.from && !filters.dateRange.to) {
      return `From ${format(filters.dateRange.from, 'MMM dd, yyyy')}`;
    }
    if (!filters.dateRange.from && filters.dateRange.to) {
      return `Until ${format(filters.dateRange.to, 'MMM dd, yyyy')}`;
    }
    return `${format(filters.dateRange.from!, 'MMM dd')} - ${format(filters.dateRange.to!, 'MMM dd, yyyy')}`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} filters</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              {isExpanded ? (
                <>
                  Hide Filters
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Show Filters
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Search */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, reference, email..."
              value={filters.query}
              onChange={(e) => updateFilter('query', e.target.value)}
              className="pl-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>

        {/* Results Summary */}
        {resultCount !== undefined && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{resultCount} results found</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Advanced Filters (Collapsible) */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Status</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {statusOptions.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={filters.status.includes(status.value)}
                      onCheckedChange={(checked) => 
                        updateArrayFilter('status', status.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`status-${status.value}`} className="text-sm flex items-center gap-1">
                      {status.label}
                      <Badge variant="outline" className="text-xs">
                        {status.count}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Type Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Application Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {typeOptions.map((type) => (
                  <div key={type.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type.value}`}
                      checked={filters.type.includes(type.value)}
                      onCheckedChange={(checked) => 
                        updateArrayFilter('type', type.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`type-${type.value}`} className="text-sm flex items-center gap-1">
                      {type.label}
                      <Badge variant="outline" className="text-xs">
                        {type.count}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Date Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Submission Date</Label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {formatDateRange()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{
                      from: filters.dateRange.from,
                      to: filters.dateRange.to
                    }}
                    onSelect={(range) => updateFilter('dateRange', range || {})}
                    numberOfMonths={2}
                  />
                  <div className="p-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        updateFilter('dateRange', {});
                        setShowDatePicker(false);
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            {/* County Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">County</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                {LIBERIAN_COUNTIES.map((county) => (
                  <div key={county} className="flex items-center space-x-2">
                    <Checkbox
                      id={`county-${county}`}
                      checked={filters.county.includes(county)}
                      onCheckedChange={(checked) => 
                        updateArrayFilter('county', county, checked as boolean)
                      }
                    />
                    <Label htmlFor={`county-${county}`} className="text-sm">
                      {county}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Assignee Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Assigned To</Label>
              <div className="grid grid-cols-2 gap-2">
                {assigneeOptions.map((assignee) => (
                  <div key={assignee.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`assignee-${assignee.value}`}
                      checked={filters.assignedTo.includes(assignee.value)}
                      onCheckedChange={(checked) => 
                        updateArrayFilter('assignedTo', assignee.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={`assignee-${assignee.value}`} className="text-sm">
                      {assignee.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Amount Range Filter */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Fee Amount (USD)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="min-amount" className="text-xs text-muted-foreground">
                    Minimum
                  </Label>
                  <Input
                    id="min-amount"
                    type="number"
                    placeholder="0"
                    value={filters.amount.min || ''}
                    onChange={(e) => 
                      updateFilter('amount', {
                        ...filters.amount,
                        min: e.target.value ? parseFloat(e.target.value) : undefined
                      })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="max-amount" className="text-xs text-muted-foreground">
                    Maximum
                  </Label>
                  <Input
                    id="max-amount"
                    type="number"
                    placeholder="1000"
                    value={filters.amount.max || ''}
                    onChange={(e) => 
                      updateFilter('amount', {
                        ...filters.amount,
                        max: e.target.value ? parseFloat(e.target.value) : undefined
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button variant="outline" onClick={handleReset} disabled={!hasActiveFilters}>
                <X className="h-4 w-4 mr-1" />
                Reset Filters
              </Button>
              <Button onClick={handleSearch} disabled={loading}>
                <Filter className="h-4 w-4 mr-1" />
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {hasActiveFilters && !isExpanded && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.query && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Query: "{filters.query}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('query', '')}
                />
              </Badge>
            )}
            {filters.status.map(status => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                Status: {status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateArrayFilter('status', status, false)}
                />
              </Badge>
            ))}
            {filters.type.map(type => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                Type: {type}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateArrayFilter('type', type, false)}
                />
              </Badge>
            ))}
            {(filters.dateRange.from || filters.dateRange.to) && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Date: {formatDateRange()}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilter('dateRange', {})}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}