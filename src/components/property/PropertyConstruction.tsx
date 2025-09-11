import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  FOUNDATION_MATERIALS,
  WALL_MATERIALS,
  ROOF_MATERIALS,
  FLOOR_MATERIALS
} from '../shared/constants';

interface PropertyConstructionProps {
  data: {
    stories: string;
    bedrooms: string;
    bathrooms: string;
    windows: string;
    foundation: string;
    walls: string;
    roof: string;
    floor: string;
    windowMaterial: string;
  };
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export default function PropertyConstruction({ data, onChange, errors }: PropertyConstructionProps) {
  return (
    <>
      {/* Physical Features */}
      <div className="space-y-4">
        <h4 className="text-lg">Physical Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stories">Number of Stories</Label>
            <Input
              id="stories"
              type="number"
              value={data.stories}
              onChange={(e) => onChange('stories', e.target.value)}
              placeholder="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms *</Label>
            <Input
              id="bedrooms"
              type="number"
              value={data.bedrooms}
              onChange={(e) => onChange('bedrooms', e.target.value)}
              className={errors.bedrooms ? 'border-red-500' : ''}
              placeholder="0"
            />
            {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms *</Label>
            <Input
              id="bathrooms"
              type="number"
              value={data.bathrooms}
              onChange={(e) => onChange('bathrooms', e.target.value)}
              className={errors.bathrooms ? 'border-red-500' : ''}
              placeholder="0"
            />
            {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="windows">Number of Windows</Label>
            <Input
              id="windows"
              type="number"
              value={data.windows}
              onChange={(e) => onChange('windows', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Construction Materials */}
      <div className="space-y-4">
        <h4 className="text-lg">Construction Materials</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="foundation">Foundation *</Label>
            <Select value={data.foundation} onValueChange={(value) => onChange('foundation', value)}>
              <SelectTrigger className={errors.foundation ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select foundation" />
              </SelectTrigger>
              <SelectContent>
                {FOUNDATION_MATERIALS.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.foundation && <p className="text-red-500 text-sm">{errors.foundation}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="walls">Walls *</Label>
            <Select value={data.walls} onValueChange={(value) => onChange('walls', value)}>
              <SelectTrigger className={errors.walls ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select wall material" />
              </SelectTrigger>
              <SelectContent>
                {WALL_MATERIALS.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.walls && <p className="text-red-500 text-sm">{errors.walls}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="roof">Roof *</Label>
            <Select value={data.roof} onValueChange={(value) => onChange('roof', value)}>
              <SelectTrigger className={errors.roof ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select roof material" />
              </SelectTrigger>
              <SelectContent>
                {ROOF_MATERIALS.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roof && <p className="text-red-500 text-sm">{errors.roof}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">Floor Material</Label>
            <Select value={data.floor} onValueChange={(value) => onChange('floor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select floor material" />
              </SelectTrigger>
              <SelectContent>
                {FLOOR_MATERIALS.map(material => (
                  <SelectItem key={material} value={material}>{material}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="windowMaterial">Window Material</Label>
            <Input
              id="windowMaterial"
              value={data.windowMaterial}
              onChange={(e) => onChange('windowMaterial', e.target.value)}
              placeholder="e.g., Glass, Wood, Metal"
            />
          </div>
        </div>
      </div>
    </>
  );
}