'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Booking, Pet, Service } from '@/types';
import { CreateBookingDialog } from './CreateBookingDialog';
import { useApi } from '@/hooks/useApi';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface BookingListProps {
  bookings: Booking[];
  pets: Pet[];
  services: Service[];
  onBookingCreated: () => void;
}

export function BookingList({ bookings, pets, services, onBookingCreated }: BookingListProps) {
  const { post, delete: del } = useApi();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingBookingId, setDeletingBookingId] = useState<string | null>(null);

  const handleCreateBooking = async (bookingData: any) => {
    setIsCreating(true);
    try {
      await post('/api/bookings', bookingData);
      onBookingCreated();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    setDeletingBookingId(bookingId);
    try {
      await del(`/api/bookings/${bookingId}`);
      onBookingCreated();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setDeletingBookingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'PENDING':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmada';
      case 'PENDING':
        return 'Pendiente';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPLETED':
        return 'Completada';
      default:
        return status;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      case 'COMPLETED':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatBookingDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  };

  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const upcomingBookings = sortedBookings.filter(
    booking => new Date(booking.date) > new Date() && booking.status !== 'CANCELLED'
  );

  const pastBookings = sortedBookings.filter(
    booking => new Date(booking.date) <= new Date() || booking.status === 'CANCELLED'
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span>Mis Reservas</span>
              </CardTitle>
              <CardDescription>
                Gestiona tus citas y servicios
              </CardDescription>
            </div>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reserva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tienes reservas registradas
              </h3>
              <p className="text-gray-500 mb-6">
                Agenda tu primera cita para que tu mascota reciba nuestros servicios
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Hacer Primera Reserva
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Upcoming Bookings */}
              {upcomingBookings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-orange-500" />
                    Próximas Citas ({upcomingBookings.length})
                  </h4>
                  <div className="space-y-3">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold text-lg">{booking.service?.name}</h4>
                                <Badge variant={getStatusVariant(booking.status) as any} className="flex items-center space-x-1">
                                  {getStatusIcon(booking.status)}
                                  <span>{getStatusText(booking.status)}</span>
                                </Badge>
                              </div>
                              
                              <div className="grid md:grid-cols-2 gap-4 mb-3">
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span className="text-sm">
                                    Mascota: <strong>{booking.pet?.name}</strong> ({booking.pet?.species})
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                  <Clock className="h-4 w-4" />
                                  <span className="text-sm">{formatBookingDate(booking.date)}</span>
                                </div>
                              </div>

                              {booking.notes && (
                                <div className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700">
                                    <strong>Notas:</strong> {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="text-2xl font-bold text-orange-600 mb-2">
                                ${booking.totalPrice}
                              </div>
                              <div className="space-y-2">
                                {booking.status === 'PENDING' && (
                                  <Button variant="outline" size="sm" className="w-full">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                )}
                                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="w-full text-red-600 hover:text-red-700"
                                    onClick={() => handleCancelBooking(booking.id)}
                                    disabled={deletingBookingId === booking.id}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    {deletingBookingId === booking.id ? 'Cancelando...' : 'Cancelar'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Bookings */}
              {pastBookings.length > 0 && (
                <div>
                  <h4 className="font-semibold text-lg mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    Historial de Citas ({pastBookings.length})
                  </h4>
                  <div className="space-y-3">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="opacity-75">
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-semibold">{booking.service?.name}</h4>
                                <Badge variant={getStatusVariant(booking.status) as any} className="flex items-center space-x-1">
                                  {getStatusIcon(booking.status)}
                                  <span>{getStatusText(booking.status)}</span>
                                </Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Mascota: <strong>{booking.pet?.name}</strong></span>
                                <span>{formatBookingDate(booking.date)}</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-600">
                                ${booking.totalPrice}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateBookingDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateBooking}
        pets={pets}
        services={services}
        isLoading={isCreating}
      />
    </>
  );
}