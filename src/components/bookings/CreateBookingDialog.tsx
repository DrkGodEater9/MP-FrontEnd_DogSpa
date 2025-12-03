'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CreateBookingData, Pet, Service } from '@/types';
import { Calendar as CalendarIcon, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CreateBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookingData) => Promise<void>;
  pets: Pet[];
  services: Service[];
  isLoading?: boolean;
}

export function CreateBookingDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  pets, 
  services, 
  isLoading 
}: CreateBookingDialogProps) {
  const [formData, setFormData] = useState<CreateBookingData>({
    petId: '',
    serviceId: '',
    date: '',
    notes: ''
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.serviceId || !formData.date) {
      return;
    }

    await onSubmit(formData);
    
    // Reset form
    setFormData({
      petId: '',
      serviceId: '',
      date: '',
      notes: ''
    });
    setSelectedDate(undefined);
    onClose();
  };

  const handleInputChange = (field: keyof CreateBookingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Format date to ISO string for the API
      const isoString = date.toISOString();
      setFormData(prev => ({
        ...prev,
        date: isoString
      }));
    }
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-orange-500" />
            <span>Nueva Reserva</span>
          </DialogTitle>
          <DialogDescription>
            Agenda un servicio para tu mascota
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pet">Mascota *</Label>
              <Select value={formData.petId} onValueChange={(value) => handleInputChange('petId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Servicio *</Label>
              <Select value={formData.serviceId} onValueChange={(value) => handleInputChange('serviceId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      <div className="flex flex-col">
                        <span>{service.name}</span>
                        <span className="text-sm text-gray-500">
                          ${service.price} • {service.duration}min
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fecha y Hora *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: es })
                  ) : (
                    "Selecciona una fecha"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => 
                    date < new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {selectedDate && (
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                min="09:00"
                max="18:00"
                value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
                onChange={(e) => {
                  if (selectedDate && e.target.value) {
                    const [hours, minutes] = e.target.value.split(':');
                    const newDate = new Date(selectedDate);
                    newDate.setHours(parseInt(hours), parseInt(minutes));
                    handleDateSelect(newDate);
                  }
                }}
              />
            </div>
          )}

          {selectedService && (
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{selectedService.name}</h4>
                <span className="text-lg font-bold text-orange-600">
                  ${selectedService.price}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{selectedService.duration} minutos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${selectedService.price}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-2">{selectedService.description}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Instrucciones especiales, alergias, comportamiento, etc..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.petId || !formData.serviceId || !formData.date} 
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isLoading ? 'Reservando...' : 'Confirmar Reserva'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}