 'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PawPrint, Scissors, Heart, Clock, Users, Award, MapPin, Phone, Mail, Star, Package } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const services = [
  {
    id: '1',
    name: 'Baño y Corte',
    description: 'Servicio completo de higiene que incluye baño, corte de pelo, limpieza de orejas y corte de uñas.',
    duration: 90,
    category: 'Belleza',
    icon: Scissors
  },
  {
    id: '2',
    name: 'Baño Simple',
    description: 'Baño con productos de alta calidad, secado y cepillado básico.',
    duration: 60,
    category: 'Higiene',
    icon: PawPrint
  },
  {
    id: '3',
    name: 'Spa Completo',
    description: 'Experiencia premium con baño terapéutico, masaje relajante y tratamiento de hidratación.',
    duration: 120,
    category: 'Spa',
    icon: Heart
  },
  {
    id: '4',
    name: 'Corte Estilizado',
    description: 'Corte de pelo personalizado según la raza y preferencias del dueño.',
    duration: 45,
    category: 'Belleza',
    icon: Scissors
  }
];

const products = [
  {
    id: '1',
    name: 'Champú Premium',
    description: 'Champú hipoalergénico para mascotas con piel sensible.',
    category: 'Higiene'
  },
  {
    id: '2',
    name: 'Juguete Interactivo',
    description: 'Juguete educativo que estimula la mente de tu mascota.',
    category: 'Juguetes'
  },
  {
    id: '3',
    name: 'Cama Premium',
    description: 'Cama ortopédica para máximo confort de tu mascota.',
    category: 'Accesorios'
  }
];

export default function Home() {
  const { login, register } = useAuthStore();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    phone: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(loginForm);
      setIsLoginOpen(false);
      setLoginForm({ email: '', password: '' });
    } catch (err: any) {
      setError(err?.message ?? 'Error al iniciar sesión');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await register(registerForm);
      setIsLoginOpen(false);
      setRegisterForm({ email: '', password: '', firstName: '', lastName: '', phone: '' });
    } catch (err: any) {
      setError(err?.message ?? 'Error al registrar');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src="/dogspa-logo.png"
                alt="DogSpa Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold text-gray-800">DogSpa</span>
            </div>
            <div className="flex items-center space-x-3">
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost">Iniciar Sesión</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Bienvenido a DogSpa</DialogTitle>
                    <DialogDescription>
                      Inicia sesión o regístrate para acceder a nuestros servicios
                    </DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                      <TabsTrigger value="register">Registrarse</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Contraseña</Label>
                          <Input
                            id="password"
                            type="password"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                            required
                          />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">Nombre</Label>
                            <Input
                              id="firstName"
                              value={registerForm.firstName}
                              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Apellido</Label>
                            <Input
                              id="lastName"
                              value={registerForm.lastName}
                              onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">Email</Label>
                          <Input
                            id="reg-email"
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">Contraseña</Label>
                          <Input
                            id="reg-password"
                            type="password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono (opcional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                          {isSubmitting ? 'Registrando...' : 'Registrarse'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            El Spa Perfecto para tu
            <span className="text-orange-500"> Mejor Amigo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubre un lugar donde tu mascota recibirá el cuidado y atención que se merece. 
            Servicios profesionales de belleza y bienestar para mantener a tu peludo feliz y saludable.
          </p>
          <div className="flex justify-center">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8">
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Servicios</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos una amplia gama de servicios diseñados para el bienestar y belleza de tu mascota
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="flex justify-center mb-2">
                      <Badge variant="secondary">{service.duration} min</Badge>
                    </div>
                    <p className="text-sm text-gray-500">{service.category}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Nuestra Historia</h2>
              <p className="text-lg text-gray-600 mb-4">
                DogSpa nació en 2020 con una misión clara: proporcionar el mejor cuidado posible 
                para nuestras mascotas. Como amantes de los animales, entendemos que cada peludo 
                es miembro de la familia y merece ser tratado con el máximo amor y respeto.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Nuestro equipo de profesionales está altamente capacitado en las últimas técnicas 
                de grooming y bienestar animal. Utilizamos solo productos de la más alta calidad 
                que son seguros y suaves para la piel de tu mascota.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">500+</p>
                    <p className="text-gray-600">Clientes Felices</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold text-gray-800">5 años</p>
                    <p className="text-gray-600">De Experiencia</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">¿Por qué elegirnos?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Heart className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Cuidado con Amor</h4>
                    <p className="text-gray-600">Tratamos a cada mascota como si fuera nuestra</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Star className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Profesionales Certificados</h4>
                    <p className="text-gray-600">Equipo experto en cuidado animal</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Package className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Productos Premium</h4>
                    <p className="text-gray-600">Solo los mejores productos para tu mascota</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-6 w-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Servicio a Tiempo</h4>
                    <p className="text-gray-600">Respetamos tu tiempo y el de tu mascota</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Nuestros Productos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Lleva a casa los mejores productos para el cuidado diario de tu mascota
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gray-800 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Contáctanos</h2>
            <p className="text-lg text-gray-300">
              Estamos aquí para responder tus preguntas y ayudarte a cuidar a tu mascota
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <Phone className="h-8 w-8 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
              <p className="text-gray-300">+1 (555) 123-4567</p>
            </div>
            <div className="text-center">
              <Mail className="h-8 w-8 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-gray-300">info@dogspa.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img
              src="/dogspa-logo.png"
              alt="DogSpa Logo"
              className="h-6 w-6 object-contain"
            />
            <span className="text-xl font-bold">DogSpa</span>
          </div>
          <p className="text-gray-400">
            © 2024 DogSpa. Todos los derechos reservados. Hecho con amor para nuestras mascotas.
          </p>
        </div>
      </footer>
    </div>
  );
}