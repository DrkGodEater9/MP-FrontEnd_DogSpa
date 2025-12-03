'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreatePetData } from '@/types';
import { PawPrint } from 'lucide-react';

interface CreatePetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePetData) => Promise<void>;
  isLoading?: boolean;
}

export function CreatePetDialog({ isOpen, onClose, onSubmit, isLoading }: CreatePetDialogProps) {
  const [formData, setFormData] = useState<CreatePetData>({
    name: '',
    species: '',
    breed: '',
    age: undefined,
    weight: undefined,
    specialNotes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.species) {
      return;
    }

    await onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      species: '',
      breed: '',
      age: undefined,
      weight: undefined,
      specialNotes: ''
    });
    
    onClose();
  };

  const handleInputChange = (field: keyof CreatePetData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PawPrint className="h-5 w-5 text-orange-500" />
            <span>Registrar Nueva Mascota</span>
          </DialogTitle>
          <DialogDescription>
            Añade la información de tu mascota para poder gestionar sus servicios
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nombre de la mascota"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="species">Especie *</Label>
              <Select value={formData.species} onValueChange={(value) => handleInputChange('species', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perro">Perro</SelectItem>
                  <SelectItem value="gato">Gato</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="breed">Raza</Label>
              <Input
                id="breed"
                value={formData.breed}
                onChange={(e) => handleInputChange('breed', e.target.value)}
                placeholder="Raza (opcional)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Edad (años)</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="30"
                value={formData.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Edad en años"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Peso en kilogramos"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialNotes">Notas Especiales</Label>
            <Textarea
              id="specialNotes"
              value={formData.specialNotes}
              onChange={(e) => handleInputChange('specialNotes', e.target.value)}
              placeholder="Alergias, comportamiento especial, necesidades específicas..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name || !formData.species} className="bg-orange-500 hover:bg-orange-600">
              {isLoading ? 'Registrando...' : 'Registrar Mascota'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}