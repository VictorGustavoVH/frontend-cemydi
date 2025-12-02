"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { isInactive, logout, updateLastActivity, isAuthenticated } from "@/lib/auth";

/**
 * Componente que monitorea la inactividad del usuario,
 * muestra una alerta previa y cierra sesión automáticamente
 * después del tiempo configurado de inactividad.
 *
 * OPTIMIZADO: Usa throttling para evitar actualizar localStorage constantemente
 */
export default function InactivityMonitor() {
  const lastUpdateRef = useRef<number>(0);
  const warningShownRef = useRef<boolean>(false);
  const throttleDelay = 10000; // Actualizar máximo cada 10 segundos

  useEffect(() => {
    // Función para actualizar la última actividad con throttling
    // Solo actualiza localStorage si han pasado al menos 10 segundos
    // Esto evita saturar el navegador con escrituras constantes
    const handleActivity = () => {
      // Solo actualizar si el usuario está autenticado
      if (!isAuthenticated()) {
        return;
      }

      const now = Date.now();
      
      // Throttling: solo actualizar localStorage si han pasado suficientes segundos
      if (now - lastUpdateRef.current > throttleDelay) {
        updateLastActivity();
        lastUpdateRef.current = now;
      }
    };

    // Eventos que indican actividad del usuario
    // IMPORTANTE: NO incluimos 'mousemove' porque se dispara miles de veces por segundo
    // Solo usamos eventos que realmente indican interacción intencional del usuario
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart', 'click', 'focus', 'keydown'];

    // Agregar listeners para eventos de actividad
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // También escuchar cuando el usuario vuelve a la pestaña
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated()) {
        // Si la pestaña vuelve a estar visible, verificar inactividad
        if (isInactive()) {
          logout();
        } else {
          // Actualizar actividad cuando vuelve a la pestaña
          updateLastActivity();
          lastUpdateRef.current = Date.now();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Verificar inactividad periódicamente (cada 30 segundos)
    // Esto es suficiente para detectar inactividad sin sobrecargar el sistema
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        return;
      }

      const lastActivity = localStorage.getItem("lastActivity");
      const lastActivityTime = lastActivity ? parseInt(lastActivity, 10) : 0;
      const now = Date.now();
      const inactiveTime = now - lastActivityTime;

      const WARNING_INACTIVITY_MS = 10 * 60 * 1000; // 10 minutos
      const TIMEOUT_INACTIVITY_MS = 12 * 60 * 1000; // 12 minutos

      // Mostrar aviso si se supera el umbral de aviso pero aún no el de cierre
      if (
        inactiveTime >= WARNING_INACTIVITY_MS &&
        inactiveTime < TIMEOUT_INACTIVITY_MS &&
        !warningShownRef.current
      ) {
        warningShownRef.current = true;
        toast((t) => (
          <div className="flex flex-col gap-2">
            <span className="font-medium">Sesión inactiva</span>
            <span className="text-sm text-gray-700">
              Tu sesión se cerrará automáticamente por inactividad en menos de 2 minutos.
            </span>
            <button
              onClick={() => {
                updateLastActivity();
                lastUpdateRef.current = Date.now();
                warningShownRef.current = false;
                toast.dismiss(t.id);
              }}
              className="mt-1 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Seguir conectado
            </button>
          </div>
        ), {
          duration: 60_000,
        });
      }

      // Cerrar sesión cuando se supera el timeout o la función de ayuda lo indica
      if (inactiveTime >= TIMEOUT_INACTIVITY_MS || isInactive()) {
        logout();
      }
    }, 30 * 1000); // Verificar cada 30 segundos

    // Inicializar la última actividad al montar
    updateLastActivity();
    lastUpdateRef.current = Date.now();

    // Limpiar listeners y intervalos al desmontar
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Este componente no renderiza nada
  return null;
}

