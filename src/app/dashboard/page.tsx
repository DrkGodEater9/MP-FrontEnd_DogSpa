'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/auth';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PetList } from '@/components/pets/PetList';
import { BookingList } from '@/components/bookings/BookingList';
import { ProductList } from '@/components/products/ProductList';
import { 
  PawPrint, 
  Calendar, 
  ShoppingBag, 
  History, 
  LogOut,
  Home,
  Package,
  Clock
} from 'lucide-react';
import { Pet, Booking, Product, Sale } from '@/types';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { get } = useApi();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [petsData, bookingsData, productsData, salesData, servicesData] = await Promise.all([
        get('/api/pets'),
        get('/api/bookings'),
        get('/api/products'),
        get('/api/sales'),
        get('/api/services')
      ]);
      
      setPets(petsData || []);
      setBookings(bookingsData || []);
      setProducts(productsData || []);
      setSales(salesData || []);
      setServices(servicesData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataUpdate = () => {
    fetchData();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="/dogspa-logo.png"
                    alt="DogSpa Logo"
                    className="h-8 w-8 object-contain"
                  />
                  <span className="text-2xl font-bold text-gray-800">DogSpa</span>
                </div>
                <nav className="hidden md:flex space-x-6">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Home className="h-4 w-4" />
                    <span>Inicio</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Reservas</span>
                  </Button>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Tienda</span>
                  </Button>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarFallback>
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                  <LogOut className="h-4 w-4" />
                  <span>Salir</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              ¡Bienvenido de vuelta, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Gestiona tus mascotas, reserva servicios y compra productos desde aquí.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mis Mascotas</CardTitle>
                <PawPrint className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pets.length}</div>
                <p className="text-xs text-gray-500">Registradas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximas Citas</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </div>
                <p className="text-xs text-gray-500">Confirmadas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingBag className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales.length}</div>
                <p className="text-xs text-gray-500">Realizados</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Servicios Totales</CardTitle>
                <History className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{bookings.length}</div>
                <p className="text-xs text-gray-500">Historial completo</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="pets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pets" className="flex items-center space-x-2">
                <PawPrint className="h-4 w-4" />
                <span>Mis Mascotas</span>
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Reservas</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Tienda</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center space-x-2">
                <History className="h-4 w-4" />
                <span>Historial</span>
              </TabsTrigger>
            </TabsList>

            {/* Pets Tab */}
            <TabsContent value="pets">
              <PetList 
                pets={pets} 
                onPetCreated={handleDataUpdate}
              />
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings">
              <BookingList 
                bookings={bookings}
                pets={pets}
                services={services}
                onBookingCreated={handleDataUpdate}
              />
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <ProductList 
                products={products}
                onPurchaseComplete={handleDataUpdate}
              />
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Historial Completo</CardTitle>
                  <CardDescription>
                    Revisa todas tus reservas y compras anteriores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Historial de Reservas
                      </h4>
                      {bookings.length === 0 ? (
                        <p className="text-gray-500">No tienes reservas en el historial</p>
                      ) : (
                        <div className="space-y-3">
                          {bookings.map((booking) => (
                            <div key={booking.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">{booking.service?.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {booking.pet?.name} • {new Date(booking.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline">{booking.status}</Badge>
                                  <p className="text-sm mt-1">${booking.totalPrice}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4 flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Historial de Compras
                      </h4>
                      {sales.length === 0 ? (
                        <p className="text-gray-500">No tienes compras en el historial</p>
                      ) : (
                        <div className="space-y-3">
                          {sales.map((sale) => (
                            <div key={sale.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">Pedido #{sale.id.slice(-8)}</p>
                                  <p className="text-sm text-gray-500">
                                    {sale.items.length} productos • {new Date(sale.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline">{sale.status}</Badge>
                                  <p className="text-sm mt-1">${sale.totalAmount}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}