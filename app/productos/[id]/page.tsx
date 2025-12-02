"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Calendar, ShoppingBag, CheckCircle, X, ZoomIn } from "lucide-react";
import toast from "react-hot-toast";
import { getProductById } from "@/lib/api-requests";
import type { Product, ApiError } from "@/lib/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!params?.id) return;
      try {
        const data = await getProductById(params.id);
        setProduct(data);
      } catch (err: any) {
        const apiError: ApiError = err;
        const message = Array.isArray(apiError.message)
          ? apiError.message.join(", ")
          : apiError.message || "No se pudo cargar el producto.";
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [params?.id]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(value);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-[calc(100vh-8rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#29A2A1] mb-8 transition-colors duration-200 font-[var(--font-inter)] group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          Volver al catálogo
        </button>

        {isLoading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 border-2 border-red-100 p-8">
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
        ) : !product ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2 font-[var(--font-montserrat)]">
              Producto no encontrado
            </h3>
            <p className="text-gray-600 font-[var(--font-inter)]">
              El producto que buscas no está disponible.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Image Section */}
            <div className="relative">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 flex items-center justify-center min-h-[300px] lg:min-h-[350px] relative group cursor-pointer" onClick={() => product.imageUrl && setIsImageModalOpen(true)}>
                {product.imageUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="max-h-[350px] w-auto object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                      loading="eager"
                    />
                    {/* Overlay con icono de zoom */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg">
                        <ZoomIn className="w-6 h-6 text-[#29A2A1]" />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Package className="w-16 h-16 text-[#29A2A1]" />
                    <p className="text-gray-500 font-[var(--font-inter)]">Sin imagen</p>
                  </div>
                )}
              </div>
              {/* Badge */}
              {product.isRental && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-10">
                  <Calendar className="w-4 h-4 text-[#29A2A1]" />
                  <span className="text-xs font-semibold text-[#29A2A1] font-[var(--font-inter)]">
                    Disponible para renta
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 font-[var(--font-montserrat)]">
                    {product.name}
                  </h1>
                  <p className="text-base lg:text-lg text-gray-600 leading-relaxed font-[var(--font-inter)]">
                    {product.description}
                  </p>
                </div>

                {/* Product Info */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                    <ShoppingBag className="w-4 h-4 text-[#29A2A1]" />
                    <span className="text-sm font-medium text-gray-700 font-[var(--font-inter)]">
                      {product.isRental ? "Renta" : "Venta"}
                    </span>
                  </div>
                  {product.isRental && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-[#29A2A1]" />
                      <span className="text-sm font-medium text-gray-700 font-[var(--font-inter)]">
                        Por {product.rentalUnit || "mes"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 font-[var(--font-inter)]">
                      Disponible
                    </span>
                  </div>
                </div>

                {/* Price Section */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl lg:text-4xl font-bold text-[#29A2A1] font-[var(--font-montserrat)]">
                      {formatPrice(product.price)}
                    </span>
                    {product.isRental && (
                      <span className="text-base text-gray-500 font-[var(--font-inter)]">
                        /{product.rentalUnit || "mes"}
                      </span>
                    )}
                  </div>
                  {product.isRental && (
                    <p className="text-sm text-gray-500 font-[var(--font-inter)]">
                      Precio de renta por {product.rentalUnit || "mes"}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#29A2A1] to-[#20626C] hover:from-[#20626C] hover:to-[#1C6C53] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29A2A1]/50 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Solicitar información
                </button>
                <p className="text-center text-xs text-gray-500 mt-3 font-[var(--font-inter)]">
                  Nos pondremos en contacto contigo a la brevedad
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de imagen ampliada */}
      {isImageModalOpen && product?.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Botón cerrar */}
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm p-3 rounded-full text-white transition-colors duration-200"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Imagen ampliada */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-w-full max-h-[90vh] w-auto h-auto object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}


