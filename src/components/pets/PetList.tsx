'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Pet } from '@/types';
import { CreatePetDialog } from './CreatePetDialog';
import { useApi } from '@/hooks/useApi';
import { PawPrint, Edit, Trash2 } from 'lucide-react';

interface PetListProps {
  pets: Pet[];
  onPetCreated: () => void;
}

export function PetList({ pets, onPetCreated }: PetListProps) {
  const { post, delete: del } = useApi();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingPetId, setDeletingPetId] = useState<string | null>(null);

  const handleCreatePet = async (petData: any) => {
    setIsCreating(true);
    try {
      await post('/api/pets', petData);
      onPetCreated();
    } catch (error) {
      console.error('Error creating pet:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeletePet = async (petId: string) => {
    setDeletingPetId(petId);
    try {
      await del(`/api/pets/${petId}`);
      onPetCreated();
    } catch (error) {
      console.error('Error deleting pet:', error);
    } finally {
      setDeletingPetId(null);
    }
  };

  const getSpeciesIcon = (species: string) => {
    return species.toLowerCase() === 'gato' ? '🐱' : '🐕';
  };

  const getAgeText = (age?: number) => {
    if (!age) return 'Edad desconocida';
    if (age === 1) return '1 año';
    return `${age} años`;
  };

  const getWeightText = (weight?: number) => {
    if (!weight) return 'Peso desconocido';
    return `${weight} kg`;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <PawPrint className="h-5 w-5 text-orange-500" />
                <span>Mis Mascotas</span>
              </CardTitle>
              <CardDescription>
                Gestiona la información de tus mascotas
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Nueva Mascota
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {pets.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🐾</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tienes mascotas registradas
              </h3>
              <p className="text-gray-500 mb-6">
                Registra tu primera mascota para comenzar a gestionar sus servicios
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <PawPrint className="h-4 w-4 mr-2" />
                Registrar Primera Mascota
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-md transition-shadow border-l-4 border-l-orange-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 bg-orange-100">
                          <AvatarFallback className="text-2xl">
                            {getSpeciesIcon(pet.species)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{pet.name}</CardTitle>
                          <CardDescription className="flex items-center space-x-2">
                            <span>{pet.breed || 'Raza no especificada'}</span>
                            <Badge variant="secondary" className="text-xs">
                              {pet.species}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Edad:</span>
                        <span className="font-medium">{getAgeText(pet.age)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Peso:</span>
                        <span className="font-medium">{getWeightText(pet.weight)}</span>
                      </div>
                    </div>
                    
                    {pet.specialNotes && (
                      <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Notas:</span> {pet.specialNotes}
                        </p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600 hover:text-red-700"
                        onClick={() => handleDeletePet(pet.id)}
                        disabled={deletingPetId === pet.id}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        {deletingPetId === pet.id ? 'Eliminando...' : 'Eliminar'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePetDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreatePet}
        isLoading={isCreating}
      />
    </>
  );
}