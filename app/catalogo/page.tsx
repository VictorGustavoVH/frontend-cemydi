"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Search, ShoppingBag, Calendar } from "lucide-react";
import { getProducts } from "@/lib/api-requests";
import type { Product, ApiError } from "@/lib/types";
import toast from "react-hot-toast";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err: any) {
        const apiError: ApiError = err;
        const message = Array.isArray(apiError.message)
          ? apiError.message.join(", ")
          : apiError.message || "No se pudieron cargar los productos.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(value);

  // Skeleton loader component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-64 w-full bg-gray-200"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-8rem)]">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 font-[var(--font-montserrat)] mb-3">
                Catálogo de Productos
              </h1>
              <p className="text-lg text-gray-600 font-[var(--font-inter)] max-w-2xl">
                Explora nuestra selección completa de artículos ortopédicos disponibles para renta y venta.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
              <ShoppingBag className="w-4 h-4" />
              <span className="font-medium">{products.length} productos</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#29A2A1]/50 focus:border-transparent transition-all font-[var(--font-inter)]"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-6 max-w-md">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-900 font-[var(--font-montserrat)]">
                Error al cargar
              </h3>
            </div>
            <p className="text-sm text-red-700 font-[var(--font-inter)] ml-13">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2 font-[var(--font-montserrat)]">
              {searchQuery ? "No se encontraron productos" : "Aún no hay productos"}
            </h3>
            <p className="text-gray-600 font-[var(--font-inter)]">
              {searchQuery
                ? "Intenta con otros términos de búsqueda"
                : "Los productos aparecerán aquí cuando estén disponibles"}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-[#29A2A1] hover:text-[#20626C] font-medium font-[var(--font-inter)]"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/productos/${product.id}`}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col transform hover:-translate-y-1 cursor-pointer"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Image Section */}
                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  {product.imageUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-[#29A2A1]/10 to-[#29A2A1]/5 group-hover:from-[#29A2A1]/20 group-hover:to-[#29A2A1]/10 transition-all duration-300">
                      <Package className="w-16 h-16 text-[#29A2A1] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Badge for rental - moved here so it doesn't cover the image */}
                  {product.isRental && (
                    <div className="mb-3 inline-flex items-center gap-1.5 w-fit bg-[#29A2A1]/10 px-3 py-1.5 rounded-full">
                      <Calendar className="w-4 h-4 text-[#29A2A1]" />
                      <span className="text-xs font-semibold text-[#29A2A1] font-[var(--font-inter)]">
                        Disponible para renta
                      </span>
                    </div>
                  )}

                  <h2 className="text-xl font-bold text-gray-900 mb-2 font-[var(--font-montserrat)] group-hover:text-[#29A2A1] transition-colors duration-200 line-clamp-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-5 font-[var(--font-inter)] line-clamp-3 text-sm leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    {/* Price Section */}
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-3xl font-bold text-[#29A2A1] font-[var(--font-montserrat)]">
                          {formatPrice(product.price)}
                        </span>
                        {product.isRental && (
                          <span className="text-sm text-gray-500 font-[var(--font-inter)] ml-2">
                            /{product.rentalUnit || "mes"}
                          </span>
                        )}
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[#29A2A1] group-hover:translate-x-1 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Results count */}
        {!isLoading && !error && searchQuery && filteredProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-600 font-[var(--font-inter)]">
            Mostrando {filteredProducts.length} de {products.length} productos
          </div>
        )}
      </section>
    </div>
  );
}


