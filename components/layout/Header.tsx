"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Users,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Package,
  Settings,
  User,
  Shield,
} from "lucide-react";
import { isAuthenticated, logout, getStoredUserRole, isAdmin } from "@/lib/auth";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGestionOpen, setIsGestionOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Detectar estado de autenticación y rol
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
      setUserRole(getStoredUserRole());
    };

    checkAuth();

    // Escuchar cambios en localStorage (cuando se hace login/logout en otra pestaña)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);

    // Verificar también en intervalos para cambios en la misma pestaña
    const interval = setInterval(() => {
      checkAuth();
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('[data-settings-menu]') &&
        !target.closest('[data-settings-button]')
      ) {
        setIsSettingsOpen(false);
      }
      if (
        !target.closest('[data-gestion-menu]') &&
        !target.closest('[data-gestion-button]')
      ) {
        setIsGestionOpen(false);
      }
    };

    if (isSettingsOpen || isGestionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, isGestionOpen]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    setIsGestionOpen(false);
    setIsSettingsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) {
        setIsGestionOpen(false);
        setIsSettingsOpen(false);
      }
      return next;
    });
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsGestionOpen(false);
    setIsSettingsOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo y marca */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-black hover:text-[#29A2A1] transition-colors duración-200"
              onClick={closeMobileMenu}
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#29A2A1] text-white font-semibold text-lg sm:text-xl">
                C
              </div>
              <span className="font-semibold text-lg sm:text-xl hidden sm:inline">
                Ortopedia CEMYDI
              </span>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1 relative">
            {/* Inicio: siempre visible para todos */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive("/")
                  ? "bg-[#29A2A1] text-white"
                  : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
              }`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <Home className="w-4 h-4" />
              Inicio
            </Link>

            {/* Catálogo: visible para todos */}
            <Link
              href="/catalogo"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isActive("/catalogo")
                  ? "bg-[#29A2A1] text-white"
                  : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
              }`}
              aria-current={isActive("/catalogo") ? "page" : undefined}
            >
              <Package className="w-4 h-4" />
              Catálogo
            </Link>

            {/* Gestión: solo para administradores (productos y usuarios) */}
            {isLoggedIn && isAdmin() && (
              <div className="relative" data-gestion-menu>
                <button
                  type="button"
                  data-gestion-button
                  onClick={() => setIsGestionOpen((prev) => !prev)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duración-200 ${
                    isActive("/admin/productos") || isActive("/users")
                      ? "bg-[#29A2A1] text-white"
                      : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Gestión
                </button>
                {isGestionOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg z-50">
                    <Link
                      href="/admin/productos"
                      onClick={() => setIsGestionOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Package className="w-4 h-4 text-[#29A2A1]" />
                      Productos
                    </Link>
                    <Link
                      href="/users"
                      onClick={() => setIsGestionOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Users className="w-4 h-4 text-[#29A2A1]" />
                      Usuarios
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Configuración: menú desplegable (desktop) */}
            {isLoggedIn && (
              <div className="relative" data-settings-menu>
                <button
                  type="button"
                  data-settings-button
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors duración-200 ${
                    isActive("/profile")
                      ? "bg-[#29A2A1] text-white"
                      : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
                  }`}
                  aria-label="Configuración"
                >
                  <Settings className="w-4 h-4" />
                </button>
                {isSettingsOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-200 shadow-lg z-50 overflow-hidden">
                    <Link
                      href="/profile"
                      onClick={() => setIsSettingsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                    >
                      <User className="w-4 h-4 text-[#29A2A1]" />
                      Editar perfil
                    </Link>
                    <Link
                      href="/profile#mfa"
                      onClick={() => setIsSettingsOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100"
                    >
                      <Shield className="w-4 h-4 text-[#29A2A1]" />
                      Autenticación MFA
                    </Link>
                    <button
                      onClick={() => {
                        setIsSettingsOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duración-200 ${
                    isActive("/login")
                      ? "bg-[#29A2A1] text-white"
                      : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#29A2A1] hover:bg-[#20626C] active:bg-[#1C6C53] transition-all duración-200"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrarse
                </Link>
              </>
            )}

          </nav>

          {/* Botón menú móvil */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:text-[#29A2A1] hover:bg-gray-100 transition-colors duración-200"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-2">
            {/* Inicio: siempre visible para todos */}
            <Link
              href="/"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duración-200 ${
                isActive("/")
                  ? "bg-[#29A2A1] text-white"
                  : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
              }`}
              aria-current={isActive("/") ? "page" : undefined}
            >
              <Home className="w-5 h-5" />
              Inicio
            </Link>

            {/* Catálogo: visible para todos en móvil */}
            <Link
              href="/catalogo"
              onClick={closeMobileMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duración-200 ${
                isActive("/catalogo")
                  ? "bg-[#29A2A1] text-white"
                  : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
              }`}
              aria-current={isActive("/catalogo") ? "page" : undefined}
            >
              <Package className="w-5 h-5" />
              Catálogo
            </Link>

            {/* Gestión: solo para administradores (productos y usuarios) */}
            {isLoggedIn && isAdmin() && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsGestionOpen((prev) => !prev)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duración-200 ${
                    isActive("/admin/productos") || isActive("/users")
                      ? "bg[#29A2A1] text-white"
                      : "text-gray-700 hover:text[#29A2A1] hover:bg[#29A2A1]/10"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Gestión
                </button>
                {isGestionOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    <Link
                      href="/admin/productos"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Package className="w-4 h-4 text-[#29A2A1]" />
                      Productos
                    </Link>
                    <Link
                      href="/users"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="w-4 h-4 text-[#29A2A1]" />
                      Usuarios
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Configuración / Perfil: visible para usuarios autenticados (admin y client) */}
            {isLoggedIn && (
              <div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duración-200 ${
                    isActive("/profile")
                      ? "bg-[#29A2A1] text-white"
                      : "text-gray-700 hover:text-[#29A2A1] hover:bg-[#29A2A1]/10"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  Configuración
                </button>
                {isSettingsOpen && (
                  <div className="mt-1 ml-4 space-y-1">
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <User className="w-4 h-4 text-[#29A2A1]" />
                      Editar perfil
                    </Link>
                    <Link
                      href="/profile#mfa"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Shield className="w-4 h-4 text-[#29A2A1]" />
                      Autenticación MFA
                    </Link>
                    <button
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duración-200 ${
                    isActive("/login")
                      ? "bg-[#29A2A1] text-white"
                      : "text-gray-700 hover:text[#29A2A1] hover:bg[#29A2A1]/10"
                  }`}
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-white bg-[#29A2A1] hover:bg-[#20626C] active:bg-[#1C6C53] transition-all duración-200"
                >
                  <UserPlus className="w-5 h-5" />
                  Registrarse
                </Link>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
}