import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { LIBERIAN_COUNTIES } from './constants';

interface AddressFormProps {
  data: {
    streetAddress: string;
    landmark: string;
    city: string;
    district: string;
    county: string;
    country: string;
    poBox: string;
  };
  onChange: (field: string, value: string) => void;
  errors: Record<string, string>;
  prefix?: string;
}

export default function AddressForm({ data, onChange, errors, prefix = '' }: AddressFormProps) {
  const getFieldName = (field: string) => prefix ? `${prefix}${field.charAt(0).toUpperCase() + field.slice(1)}` : field;
  const getError = (field: string) => errors[getFieldName(field)];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}streetAddress`}>Street/House Number *</Label>
          <Input
            id={`${prefix}streetAddress`}
            value={data.streetAddress}
            onChange={(e) => onChange(getFieldName('streetAddress'), e.target.value)}
            className={getError('streetAddress') ? 'border-red-500' : ''}
          />
          {getError('streetAddress') && <p className="text-red-500 text-sm">{getError('streetAddress')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}landmark`}>Landmark</Label>
          <Input
            id={`${prefix}landmark`}
            value={data.landmark}
            onChange={(e) => onChange(getFieldName('landmark'), e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}city`}>City/Town *</Label>
          <Input
            id={`${prefix}city`}
            value={data.city}
            onChange={(e) => onChange(getFieldName('city'), e.target.value)}
            className={getError('city') ? 'border-red-500' : ''}
          />
          {getError('city') && <p className="text-red-500 text-sm">{getError('city')}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}district`}>District</Label>
          <Input
            id={`${prefix}district`}
            value={data.district}
            onChange={(e) => onChange(getFieldName('district'), e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}county`}>County *</Label>
          <Select 
            value={data.county} 
            onValueChange={(value) => onChange(getFieldName('county'), value)}
          >
            <SelectTrigger className={getError('county') ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select county" />
            </SelectTrigger>
            <SelectContent>
              {LIBERIAN_COUNTIES.map(county => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getError('county') && <p className="text-red-500 text-sm">{getError('county')}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${prefix}country`}>Country</Label>
          <Input
            id={`${prefix}country`}
            value={data.country}
            onChange={(e) => onChange(getFieldName('country'), e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${prefix}poBox`}>P.O. Box</Label>
          <Input
            id={`${prefix}poBox`}
            value={data.poBox}
            onChange={(e) => onChange(getFieldName('poBox'), e.target.value)}
          />
        </div>
      </div>
    </>
  );
}