"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Stethoscope, 
  Package, 
  CircleUser, 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Heart,
  TrendingUp,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { getProducts } from "@/lib/api-requests";
import type { Product } from "@/lib/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts();
        // Mostrar los primeros 3 productos
        setFeaturedProducts(products.slice(0, 3));
      } catch (error) {
        // Si hay error, simplemente no mostrar productos destacados
        console.error("Error al cargar productos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="bg-white">
      {/* Hero Principal */}
      <section className="relative overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-12 pb-20 sm:pb-28 lg:pb-36">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#29A2A1]/10 mb-4">
                <Heart className="w-4 h-4 text-[#29A2A1]" />
                <span className="text-sm font-medium text-[#29A2A1]">Cuidando tu salud desde 2024</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 font-[var(--font-montserrat)] leading-tight text-gray-900">
                Tu bienestar es nuestra{" "}
                <span className="text-[#29A2A1]">prioridad</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 font-[var(--font-inter)] max-w-2xl leading-relaxed">
                Venta y renta de artículos ortopédicos con atención personalizada y productos de la más alta calidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#29A2A1] to-[#20626C] hover:from-[#20626C] hover:to-[#1C6C53] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29A2A1]/50 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explorar catálogo
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-[#29A2A1] bg-[#29A2A1]/10 hover:bg-[#29A2A1]/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29A2A1]/50 transition-all duration-200 border border-[#29A2A1]/20"
                >
                  Crear cuenta
                </Link>
              </div>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-br from-[#29A2A1]/5 to-[#29A2A1]/10 rounded-3xl blur-2xl"></div>
                <div className="relative p-16 rounded-3xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-lg">
                  <div className="flex items-center justify-center">
                    <Stethoscope className="w-32 h-32 text-[#29A2A1]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#29A2A1] to-[#20626C] mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29A2A1] mb-2 font-[var(--font-montserrat)]">
                100+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-[var(--font-inter)]">
                Productos disponibles
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#29A2A1] to-[#20626C] mb-4">
                <CircleUser className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29A2A1] mb-2 font-[var(--font-montserrat)]">
                500+
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-[var(--font-inter)]">
                Clientes satisfechos
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#29A2A1] to-[#20626C] mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29A2A1] mb-2 font-[var(--font-montserrat)]">
                24/7
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-[var(--font-inter)]">
                Atención disponible
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#29A2A1] to-[#20626C] mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29A2A1] mb-2 font-[var(--font-montserrat)]">
                5★
              </div>
              <div className="text-sm sm:text-base text-gray-600 font-[var(--font-inter)]">
                Calificación promedio
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-[var(--font-montserrat)]">
              ¿Por qué elegirnos?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-[var(--font-inter)]">
              Comprometidos con tu salud y bienestar, ofrecemos soluciones ortopédicas de calidad
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#29A2A1] to-[#20626C] group-hover:scale-110 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-[var(--font-montserrat)]">
                  Productos de calidad
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-[var(--font-inter)]">
                Ofrecemos equipos ortopédicos certificados y de las mejores marcas del mercado, garantizando seguridad y durabilidad.
              </p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#29A2A1] to-[#20626C] group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-[var(--font-montserrat)]">
                  Atención personalizada
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-[var(--font-inter)]">
                Nuestro equipo de profesionales está capacitado para asesorarte en cada paso del proceso, brindando soluciones adaptadas a tus necesidades.
              </p>
            </div>
            <div className="group bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#29A2A1] to-[#20626C] group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-[var(--font-montserrat)]">
                  Renta y venta
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed font-[var(--font-inter)]">
                Opciones flexibles de renta o compra según tus necesidades, con planes adaptados a tu presupuesto y tiempo de uso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-[var(--font-montserrat)]">
              Productos destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-[var(--font-inter)]">
              Descubre algunos de nuestros productos más populares
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/productos/${product.id}`}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-1"
                >
                  {product.imageUrl ? (
                    <div className="h-48 w-full overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center bg-gradient-to-br from-[#29A2A1]/10 to-[#29A2A1]/5">
                      <Package className="w-16 h-16 text-[#29A2A1]" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    {product.isRental && (
                      <div className="mb-3 inline-flex items-center gap-1.5 w-fit bg-[#29A2A1]/10 px-3 py-1 rounded-full">
                        <Calendar className="w-3 h-3 text-[#29A2A1]" />
                        <span className="text-xs font-semibold text-[#29A2A1] font-[var(--font-inter)]">
                          Renta
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 font-[var(--font-montserrat)] group-hover:text-[#29A2A1] transition-colors duration-200 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-4 font-[var(--font-inter)] line-clamp-2 text-sm leading-relaxed flex-1">
                      {product.description}
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-2xl font-bold text-[#29A2A1] font-[var(--font-montserrat)]">
                          {formatPrice(product.price)}
                        </span>
                        {product.isRental && (
                          <span className="text-sm text-gray-500 font-[var(--font-inter)]">
                            /{product.rentalUnit || "mes"}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#29A2A1] font-medium font-[var(--font-inter)]">
                        Ver detalles
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-[var(--font-inter)]">
                Pronto agregaremos productos destacados
              </p>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#29A2A1] to-[#20626C] hover:from-[#20626C] hover:to-[#1C6C53] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29A2A1]/50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Ver todos los productos
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#29A2A1] to-[#20626C] py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-[var(--font-montserrat)]">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 font-[var(--font-inter)]">
            Nuestro equipo de expertos está listo para asesorarte y encontrar la solución perfecta para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalogo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-[#29A2A1] bg-white hover:bg-gray-100 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200 shadow-xl"
            >
              Explorar catálogo completo
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all duration-200 border border-white/20"
            >
              Crear cuenta gratuita
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
