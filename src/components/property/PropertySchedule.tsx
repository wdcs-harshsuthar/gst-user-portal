import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Plus, Trash2 } from 'lucide-react';

interface Property {
  location: string;
  description: string;
  classification: string;
  value: string;
}

interface PropertyScheduleProps {
  properties: Property[];
  onAddProperty: () => void;
  onRemoveProperty: (index: number) => void;
  onUpdateProperty: (index: number, field: keyof Property, value: string) => void;
}

export default function PropertySchedule({ 
  properties, 
  onAddProperty, 
  onRemoveProperty, 
  onUpdateProperty 
}: PropertyScheduleProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Property Schedule (Multiple Properties)</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddProperty}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Classification</TableHead>
              <TableHead>Value ($)</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={property.location}
                    onChange={(e) => onUpdateProperty(index, 'location', e.target.value)}
                    placeholder="Property location"
                    className="min-w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={property.description}
                    onChange={(e) => onUpdateProperty(index, 'description', e.target.value)}
                    placeholder="Property description"
                    className="min-w-[200px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={property.classification}
                    onChange={(e) => onUpdateProperty(index, 'classification', e.target.value)}
                    placeholder="e.g., Residential, Commercial"
                    className="min-w-[150px]"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    value={property.value}
                    onChange={(e) => onUpdateProperty(index, 'value', e.target.value)}
                    placeholder="0.00"
                    className="min-w-[120px]"
                  />
                </TableCell>
                <TableCell>
                  {properties.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveProperty(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}