"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, Edit, Trash2, Link as LinkIcon } from "lucide-react";
import toast from "react-hot-toast";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/lib/api-requests";
import { isAuthenticated, isAdmin, logout } from "@/lib/auth";
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ApiError,
} from "@/lib/types";
import Link from "next/link";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    name: "",
    description: "",
    price: 0,
    isRental: false,
    rentalUnit: "mes",
    imageUrl: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UpdateProductRequest>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    // Esta lógica solo se evalúa en el cliente
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        router.push("/login");
        return;
      }
      if (!isAdmin()) {
        toast.error("Acceso denegado. Solo administradores pueden gestionar productos.");
        router.push("/");
        return;
      }

      setCanAccess(true);
      await loadProducts();
      setAuthChecked(true);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
      const apiError: ApiError = err;
      if (apiError.statusCode === 401) {
        await logout();
      } else {
        const message = Array.isArray(apiError.message)
          ? apiError.message.join(", ")
          : apiError.message || "Error al cargar productos.";
        setError(message);
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    if (!newProduct.description.trim()) {
      toast.error("La descripción es obligatoria.");
      return;
    }
    if (!newProduct.price || newProduct.price <= 0) {
      toast.error("El precio debe ser mayor a 0.");
      return;
    }

    try {
      setIsSaving(true);
      const created = await createProduct({
        ...newProduct,
        name: newProduct.name.trim(),
        description: newProduct.description.trim(),
        imageUrl: newProduct.imageUrl?.trim() || undefined,
      });
      setProducts([created, ...products]);
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        isRental: false,
        rentalUnit: "mes",
        imageUrl: "",
      });
      toast.success("Producto creado correctamente.");
    } catch (err: any) {
      const apiError: ApiError = err;
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(", ")
        : apiError.message || "Error al crear producto.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      isRental: product.isRental,
      rentalUnit: product.rentalUnit || "mes",
      imageUrl: product.imageUrl || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    if (!editForm.name?.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    if (!editForm.description?.trim()) {
      toast.error("La descripción es obligatoria.");
      return;
    }
    if (editForm.price === undefined || editForm.price <= 0) {
      toast.error("El precio debe ser mayor a 0.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateProduct(editingId, {
        ...editForm,
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        imageUrl: editForm.imageUrl?.trim() || undefined,
      });
      setProducts(products.map((p) => (p.id === editingId ? updated : p)));
      toast.success("Producto actualizado correctamente.");
      cancelEdit();
    } catch (err: any) {
      const apiError: ApiError = err;
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(", ")
        : apiError.message || "Error al actualizar producto.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (
      !confirm(
        `¿Seguro que deseas eliminar "${product.name}"? El producto dejará de mostrarse en el catálogo.`
      )
    ) {
      return;
    }
    try {
      setIsDeleting(product.id);
      await deleteProduct(product.id);
      setProducts(products.filter((p) => p.id !== product.id));
      toast.success("Producto eliminado correctamente.");
    } catch (err: any) {
      const apiError: ApiError = err;
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(", ")
        : apiError.message || "Error al eliminar producto.";
      toast.error(message);
    } finally {
      setIsDeleting(null);
    }
  };

  // Mientras validamos autenticación, mostrar un loader consistente para evitar errores de hidratación
  if (!authChecked && !canAccess) {
    return (
      <div className="bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-sm text-gray-600">Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canAccess) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4">
          <div className="p-3 rounded-full bg-[#29A2A1]/10">
            <Package className="w-6 h-6 text-[#29A2A1]" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-black">
              Gestión de Productos
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administra el catálogo de artículos ortopédicos (renta y venta).
            </p>
          </div>
        </div>

        {/* Formulario de creación */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-black mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#29A2A1]" />
            Nuevo producto
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="block w-full min-h-[40px] px-3 py-2 border border-[#9CA3AF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C] bg-white text-black text-sm"
                  placeholder="Ej. Silla de ruedas premium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Precio (MXN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: parseFloat(e.target.value || "0"),
                    })
                  }
                  className="block w-full min-h-[40px] px-3 py-2 border border-[#9CA3AF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C] bg-white text-black text-sm"
                  placeholder="Ej. 2500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Descripción
              </label>
              <textarea
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
                rows={3}
                className="block w-full px-3 py-2 border border-[#9CA3AF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C] bg-white text-black text-sm"
                placeholder="Describe brevemente el producto y sus beneficios."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="flex items-center gap-2">
                <input
                  id="isRental"
                  type="checkbox"
                  checked={newProduct.isRental}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, isRental: e.target.checked })
                  }
                  className="h-4 w-4 text-[#29A2A1] border-gray-300 rounded"
                />
                <label
                  htmlFor="isRental"
                  className="text-sm font-medium text-black"
                >
                  Es para renta
                </label>
              </div>
              {newProduct.isRental && (
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Unidad de renta
                  </label>
                  <input
                    type="text"
                    value={newProduct.rentalUnit}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        rentalUnit: e.target.value,
                      })
                    }
                    className="block w-full min-h-[40px] px-3 py-2 border border-[#9CA3AF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C] bg-white text-black text-sm"
                    placeholder="Ej. mes, día"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  URL de imagen (opcional)
                </label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, imageUrl: e.target.value })
                  }
                  className="block w-full min-h-[40px] px-3 py-2 border border-[#9CA3AF] rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C] bg-white text-black text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#29A2A1] hover:bg-[#20626C] active:bg-[#1C6C53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#29A2A1]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                {isSaving ? "Guardando..." : "Agregar producto"}
              </button>
            </div>
          </form>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          {isLoading ? (
            <p className="text-gray-600 text-sm">Cargando productos...</p>
          ) : error ? (
            <div className="rounded-xl bg-[#EE0000]/10 border border-[#EE0000]/20 p-4">
              <p className="text-sm text-[#EE0000] font-medium">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <p className="text-gray-600 text-sm">
              No hay productos en el catálogo todavía.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => {
                    const isEditing = editingId === product.id;
                    return (
                      <tr
                        key={product.id}
                        className={isEditing ? "bg-[#29A2A1]/5" : ""}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editForm.name ?? ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    name: e.target.value,
                                  })
                                }
                                className="block w-full min-h-[36px] px-3 py-1.5 border border-[#9CA3AF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C]"
                              />
                              <textarea
                                value={editForm.description ?? ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                  })
                                }
                                rows={2}
                                className="block w-full px-3 py-1.5 border border-[#9CA3AF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C]"
                              />
                              <input
                                type="url"
                                value={editForm.imageUrl ?? ""}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    imageUrl: e.target.value,
                                  })
                                }
                                placeholder="URL de imagen"
                                className="block w-full min-h-[36px] px-3 py-1.5 border border-[#9CA3AF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C]"
                              />
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium text-black">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-2">
                                {product.description}
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <div className="space-y-1">
                              <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                                <input
                                  type="checkbox"
                                  checked={!!editForm.isRental}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      isRental: e.target.checked,
                                    })
                                  }
                                  className="h-4 w-4 text-[#29A2A1] border-gray-300 rounded"
                                />
                                Es para renta
                              </label>
                              {editForm.isRental && (
                                <input
                                  type="text"
                                  value={editForm.rentalUnit ?? ""}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      rentalUnit: e.target.value,
                                    })
                                  }
                                  placeholder="Unidad (ej. mes)"
                                  className="block w-full min-h-[32px] px-3 py-1 border border-[#9CA3AF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C]"
                                />
                              )}
                            </div>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#29A2A1]/10 text-[#29A2A1]">
                              {product.isRental ? "Renta" : "Venta"}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editForm.price ?? 0}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  price: parseFloat(e.target.value || "0"),
                                })
                              }
                              className="block w-24 min-h-[36px] px-3 py-1.5 border border-[#9CA3AF] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#29A2A1] focus:border-[#20626C]"
                            />
                          ) : (
                            new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(product.price)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {product.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/productos/${product.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#20636D] bg-[#20636D]/10 rounded-lg hover:bg-[#20636D]/20 transition-colors duration-200"
                              title="Ver detalle público"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                              Ver detalle
                            </Link>
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={saveEdit}
                                  disabled={isSaving}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#33CC33] rounded-lg hover:bg-[#2BB02B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                >
                                  Guardar
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEdit(product)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#29A2A1] bg-[#29A2A1]/10 rounded-lg hover:bg-[#29A2A1]/20 transition-colors duration-200"
                                  title="Editar producto"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(product)}
                                  disabled={isDeleting === product.id}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#EE0000] bg-[#EE0000]/10 rounded-lg hover:bg-[#EE0000]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                  title="Eliminar producto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {isDeleting === product.id
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


